import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link
} from "react-router-dom";

import _ from "lodash";

import {
  Button,
  Col,
  Form,
  Nav,
  OverlayTrigger,
  Row,
  Tab,
  Table,
  Tabs,
  Tooltip,
} from "react-bootstrap";

import {
  Multiselect,
} from "multiselect-react-dropdown";

import GameContext from "../GameContext";
import { MAX_TURN_COUNT } from "../Constants";
import { ActionCard } from "./ActionArea";
import Actions, { BaseAction } from "../Action";
import Events, { BaseEvent } from "../Event";
import { INITIAL_SCHEDULE } from "../Schedule";

// Cute hack from https://gist.github.com/mattwiebe/1005915
function unCamelCase(input){return input.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/\b([A-Z]+)([A-Z])([a-z])/,'$1 $2$3').replace(/^./,function(s){return s.toUpperCase();})}

function EntityEditor(props) {
  const { actionId, eventId } = props;
  const {
    actions, updateActions,
    events, updateEvents,
  } = useContext(GameContext);
  const entityId = actionId ? actionId : eventId;
  const entity = actionId ? actions[actionId] : events[eventId];
  const entities = actionId ? actions : events;
  const updaters = {};

  for (let field of Object.keys(entity)) {
    updaters[field] = (e) => {
      const oldValue = entities[entityId][field];
      let newValue;
      switch (typeof(oldValue)) {
        case "string":
          newValue = e.target.value;
          break;
        case "number":
          newValue = parseInt(e.target.value);
          break;
        case "boolean":
          newValue = e.target.checked;
          break;
        case "object":
          newValue = e.map((item)=>item.id);
          break;
        default:
          throw new Error(`Don't know how to serialize ${field} for value ${e.target.value}`);
      }
      const updatedEntities = {
        ...entities,
        ...{
          [entityId]: {
            ...entities[entityId],
            [field]: newValue
          }
        }
      };
      const updateEntities = actionId ? updateActions : updateEvents;
      updateEntities(updatedEntities);
    }
  }
  const formGroups = Object.entries(entity)
    .filter(([field, value]) => (
      value !== null &&
      typeof(value) !== "function" &&
      // TODO: Support image uploading.
      field !== "image" &&
      // TODO: Support re-identifying.
      field !== "id"
    ))
    .map(([field, value]) => {
      let input;
      switch (typeof(value)) {
        case "string":
          input = (
            <Form.Control
              type="text"
              defaultValue={entity[field]}
              onChange={_.debounce(updaters[field], 300)}
            />
          );
          break;
        case "number":
          input = (
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip>{entity[field]}</Tooltip>}
            >
              <Form.Control
                type="range"
                defaultValue={entity[field]}
                max={10}
                onChange={_.debounce(updaters[field], 300)}
              />
            </OverlayTrigger>
          );
          break;
        case "boolean":
          input = (
            <Form.Check
              type="checkbox"
              defaultValue={entity[field]}
              onChange={updaters[field]}
            />
          );
          break;
        case "object":
          // TODO: Bogus check. Actually add a type schema.
          if (field.indexOf("Cards") >= 0) {
            let relations = actions;
            const options = Object.entries(relations).map(([id, value])=>({
              name: value.displayName,
              id: id
            }));
            const selectedValues = entity[field].map((id)=>({
              name: relations[id].displayName,
              id: id
            }));
            input = (
              <Multiselect
                id={`${entityId}.${field}`}
                selectedValues={selectedValues}
                onSelect={updaters[field]}
                onRemove={updaters[field]}
                options={options}
                displayValue="name"
              />
            );
          } else {
            throw new Error(`Unrecognized value ${value} for ${field}.`);
          }
          break;
        default:
          throw new Error(`Unrecognized value type ${value} for ${field}.`);
      }
      return (
        <Form.Group as={Row} key={`edit-${field}`} controlId={`${entityId}.${field}`}>
          <Form.Label column sm={4}>{unCamelCase(field)}</Form.Label>
          <Col sm={8}>
            {input}
          </Col>
        </Form.Group>
      );
    });
  return <>
      {formGroups}
  </>
}

function ActionsTab(props) {
  const {
    actions,
    updateActions,
  } = useContext(GameContext);
  const navs = Object.entries(actions).map(([id, action]) => (
    <Nav.Item key={id}>
      <Nav.Link eventKey={id}>{action.id}</Nav.Link>
    </Nav.Item>
  ));
  const cards = Object.entries(actions).map(([id, action]) => (
    <Tab.Pane eventKey={id} key={id}>
      <div id="card-editor-card-container">
        <ActionCard cardId={id} onClick={()=>{}} {...action}/> 
      </div>
      <EntityEditor actionId={id}/>
    </Tab.Pane>
  ));
  const newAction = () => {
    const newActionId = "Card" + (Object.keys(actions).length + 1);
    const updatedActions = {
      ...actions,
      [newActionId] : {
        ...BaseAction,
        id: newActionId,
        displayName: newActionId,
      }
    };
    updateActions(updatedActions);
  };
  return (
    <Tab.Container defaultActiveKey={Object.keys(actions)[0]}>
      <Row>
        <Col id="action-nav" sm={2}>
          <Nav variant="pills" className="flex-column">
            {navs}
            <Button onClick={newAction} variant="light">+</Button>
          </Nav>
        </Col>
        <Col sm={8}>
          <Tab.Content>
            {cards}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

function EventsTab(props) {
  const {
    events,
    updateEvents,
  } = useContext(GameContext);
  const navs = Object.entries(events).map(([id, event]) => (
    <Nav.Item key={id}>
      <Nav.Link eventKey={id}>{event.id}</Nav.Link>
    </Nav.Item>
  ));
  const eventPanes = Object.entries(events).map(([id, event]) => (
    <Tab.Pane eventKey={id} key={id}>
      <EntityEditor eventId={id}/>
    </Tab.Pane>
  ));
  const newEvent = () => {
    const newEventId = "Event" + (Object.keys(events).length + 1);
    const updatedEvents = {
      ...events,
      [newEventId] : {
        ...BaseEvent,
        id: newEventId,
        displayName: newEventId,
      }
    };
    updateEvents(updatedEvents);
  };
  return (
    <Tab.Container defaultActiveKey={Object.keys(events)[0]}>
      <Row>
        <Col id="action-nav" sm={2}>
          <Nav variant="pills" className="flex-column">
            {navs}
            <Button onClick={newEvent} variant="light">+</Button>
          </Nav>
        </Col>
        <Col sm={8}>
          <Tab.Content>
            {eventPanes}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

function ScheduleTab(props) {
  const {
    schedule,
    updateSchedule,
    events,
  } = useContext(GameContext);
  const navs = [...Array(MAX_TURN_COUNT).keys()].map((turn) => (
    <Nav.Item key={turn}>
      <Nav.Link eventKey={turn}>{"Turn " + (turn + 1)}</Nav.Link>
    </Nav.Item>
  ));
  const scheduleUpdater = (turn, updatedEvents) => {
    console.log(turn, updatedEvents);
    updateSchedule({
      ...schedule,
      [turn]: updatedEvents.map((e) => e.id),
    });
  };
  const options = Object.entries(events).map(([eventId, event]) => ({
    id: eventId,
    name: event.displayName,
  }));
  const schedulePanes = [...Array(MAX_TURN_COUNT).keys()].map((turn) => {
    const selectedValues = (schedule[turn] || []).map((eventId) => ({
      id: eventId,
      name: events[eventId].displayName,
    }));
    return (
      <Tab.Pane eventKey={turn} key={turn}>
        <Multiselect
          id={`${turn}.events`}
          selectedValues={selectedValues}
          onSelect={(l)=>scheduleUpdater(turn, l)}
          onRemove={(l)=>scheduleUpdater(turn, l)}
          options={options}
          displayValue="name"
        />
      </Tab.Pane>
    );
  });
  return (
    <Tab.Container defaultActiveKey={0}>
      <Row>
        <Col id="action-nav" sm={2}>
          <Nav variant="pills" className="flex-column">
            {navs}
          </Nav>
        </Col>
        <Col sm={8}>
          <Tab.Content>
            {schedulePanes}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

function TestChanges(props) {
  const {
    actions,
    updateActions,
    events,
    updateEvents,
    schedule,
    updateSchedule,
  } = useContext(GameContext);
  const [saveFiles, updateSaveFiles] = useState({});
  const [newSaveFileName, updateNewSaveFileName] = useState("Some Name");
  useEffect(() => {
    const json = localStorage.getItem("saveFiles");
    const knownSaves = JSON.parse(json);
    if (knownSaves) {
      updateSaveFiles(knownSaves);
    }
  }, []);
  useEffect(() => {
    const json = JSON.stringify(saveFiles);
    localStorage.setItem("saveFiles", json);
  }, [saveFiles]);
  const newSave = () => {
    const newSaveId = Object.keys(saveFiles).length;
    const newSave = {
        ...saveFiles,
        [newSaveId]: {
          name: newSaveFileName,
          actions: actions,
          events: events,
          schedule: schedule,
          timestamp: Date.now(),
        }
    };
    updateSaveFiles(newSave);
  };
  const doLoad = (saveId) => {
    // Always save before loading.
    newSave();
    const saveToLoad = saveFiles[saveId];
    updateActions(saveToLoad.actions);
    updateEvents(saveToLoad.events);
    updateSchedule(saveToLoad.schedule);
  };
  const doCopy = (saveId) => {
    navigator.clipboard.writeText(JSON.stringify(saveFiles[saveId]));
  };
  const newSaveRow = (
    <tr id="unsaved-row" key="unsaved-row">
      <td>{Object.keys(saveFiles).length}</td>
      <td>
        <Form.Control
          type="text"
          value={newSaveFileName}
          onChange={(ev) => updateNewSaveFileName(ev.target.value)}
        />
      </td>
      <td>Now</td>
      <td><Button onClick={newSave}>Save</Button></td>
      <td>Save to export</td>
      <td>Save to launch</td>
    </tr>
  );
  const saveRows = Object.entries(saveFiles).map(([saveId, saveFile]) => (
    <tr key={`save-${saveId}`}>
      <td>{saveId}</td>
      <td>{saveFile.name}</td>
      <td>{new Date(saveFile.timestamp).toLocaleString()}</td>
      <td><Button onClick={()=>doLoad(saveId)}>Load</Button></td>
      <td><Button onClick={()=>doCopy(saveId)}>Copy to Clipboard</Button></td>
      <td><Link to={`/load-config/${saveId}`} target="_blank">Launch Game</Link></td>
    </tr>
  )).reverse();
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Date</th> 
          <th>Save/Load</th>
          <th>Export</th> 
          <th>Launch</th> 
        </tr>
      </thead>
      <tbody>
        {newSaveRow}
        {saveRows}
      </tbody>
    </Table>
  );
}

function GameEditor(props) {
  const [ actions, updateActions ] = useState({...Actions});
  const [ events, updateEvents ] = useState({...Events});
  const [ schedule, updateSchedule ] = useState({...INITIAL_SCHEDULE});
  return (
    <GameContext.Provider value={{
      actions: actions, updateActions: updateActions,
      events: events, updateEvents: updateEvents,
      schedule: schedule, updateSchedule: updateSchedule,
    }}>
      <Tabs id="editor-root" defaultActiveKey="actions">
        <Tab eventKey="actions" title="Actions" key="edit-actions">
          <ActionsTab/>
        </Tab>
        <Tab eventKey="events" title="Events" key="edit-events">
          <EventsTab/>
        </Tab>
        <Tab eventKey="schedule" title="Schedule" key="edit-schedule">
          <ScheduleTab/>
        </Tab>
        <Tab eventKey="test" title="Test Changes" key="test">
          <TestChanges/>
        </Tab>
      </Tabs>
    </GameContext.Provider>
  );
}

export default GameEditor;

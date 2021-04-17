import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useHistory,
} from "react-router-dom";

import {
  Button,
  Col,
  Form,
  ListGroup,
  Nav,
  OverlayTrigger,
  Row,
  Tab,
  Table,
  Tabs,
  Tooltip,
} from "react-bootstrap";

import Select from "react-select";

import {
  Multiselect,
} from "multiselect-react-dropdown";

import GameContext from "../GameContext";
import { MAX_TURN_COUNT } from "../Constants";
import { ActionCard } from "./ActionArea";
import Actions, {
  BaseAction,
  PatchDisplayNames,
} from "../Action";
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
    updaters[field] = (e, maybeOption) => {
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
          switch(maybeOption.action) {
            case "deselect-option":
              newValue = [
                ...oldValue,
                maybeOption.option.value,
              ];
              break;
            case "remove-value":
              let sequenceIdToRemove = maybeOption.removedValue.sequenceId;
              newValue = [...oldValue];
              newValue.splice(sequenceIdToRemove, 1);
              console.log(oldValue, newValue);
              break;
            default:
              newValue = e.map(o=>o.value);
              break;
          }
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
      // The bogus key is a cute hack to force re-render of the defaultValue.
      switch (typeof(value)) {
        case "string":
          input = (
            <Form.Control
              type="text"
              value={entity[field]}
              onChange={updaters[field]}
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
                value={entity[field]}
                max={10}
                onChange={updaters[field]}
              />
            </OverlayTrigger>
          );
          break;
        case "boolean":
          input = (
            <Form.Check
              type="checkbox"
              checked={entity[field]}
              onChange={updaters[field]}
            />
          );
          break;
        case "object":
          // TODO: Bogus check. Actually add a type schema.
          if (field.indexOf("Cards") >= 0) {
            let relations = actions;
            const options = Object.entries(relations).map(([id, value])=>({
              label: value.displayName,
              value: id
            }));
            const selectedValues = entity[field].map((id, sequenceId)=>({
              label: relations[id].displayName,
              value: id,
              // This is just so we know which item was removed from the widget.
              sequenceId: sequenceId
            }));
            input = (
              <Select
                id={`${entityId}.${field}`}
                isMulti
                hideSelectedOptions={false}
                value={selectedValues}
                onChange={updaters[field]}
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
  const [ selectedAction, setSelectedAction ] = useState(Object.keys(actions)[0]);
  const navs = Object.entries(actions).map(([id, action]) => (
    <Nav.Item key={id}>
      <Nav.Link eventKey={id}>{action.id}</Nav.Link>
    </Nav.Item>
  ));
  const newAction = () => {
    const newActionId = "Card" + (Object.keys(actions).length + 1);
    const updatedActions = {
      ...actions,
      [newActionId] : {
        ...BaseAction,
        id: newActionId,
        displayName: newActionId,
        displayNameInShop: newActionId,
      }
    };
    updateActions(updatedActions);
  };
  return (
    <Row>
      <Col id="action-nav" sm={2}>
        <Nav
          variant="pills"
          className="flex-column"
          defaultActiveKey={selectedAction}
          onSelect={setSelectedAction}
        >
          {navs}
          <Button onClick={newAction} variant="light">+</Button>
        </Nav>
      </Col>
      <Col sm={8}>
        <div id="card-editor-card-container">
          <ActionCard cardId={selectedAction} onClick={()=>{}} {...actions[selectedAction]}/> 
        </div>
        <EntityEditor actionId={selectedAction}/>
      </Col>
    </Row>
  );
}

function EventsTab(props) {
  const {
    events,
    updateEvents,
  } = useContext(GameContext);
  const [ selectedEvent, setSelectedEvent ] = useState(Object.keys(events)[0]);
  const navs = Object.entries(events).map(([id, event]) => (
    <Nav.Item key={id}>
      <Nav.Link eventKey={id}>{event.id}</Nav.Link>
    </Nav.Item>
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
    <Row>
      <Col id="action-nav" sm={2}>
        <Nav
          variant="pills"
          className="flex-column"
          onSelect={setSelectedEvent}
          defaultActiveKey={selectedEvent}
        >
          {navs}
          <Button onClick={newEvent} variant="light">+</Button>
        </Nav>
      </Col>
      <Col sm={8}>
        <EntityEditor eventId={selectedEvent}/>
      </Col>
    </Row>
  );
}

function ScheduleTab(props) {
  const {
    schedule,
    updateSchedule,
    events,
  } = useContext(GameContext);
  const scheduleUpdater = (turn, updatedEvents) => {
    updateSchedule({
      ...schedule,
      [turn]: updatedEvents.map((e) => e.id),
    });
  };
  const options = Object.entries(events).map(([eventId, event]) => ({
    id: eventId,
    name: event.displayName,
  }));
  const MAX_TURNS_PER_ROW = 6;
  // Assume divisibility by 6.
  const MAX_TURNS_PER_COLUMN = MAX_TURN_COUNT / MAX_TURNS_PER_ROW;
  const rows = [...Array(MAX_TURNS_PER_COLUMN).keys()].map((row) => {
    const cols = [...Array(MAX_TURNS_PER_ROW).keys()].map((col) => {
      const turn = row * MAX_TURNS_PER_ROW + col;
      const selectedValues = (schedule[turn] || []).map((eventId) => ({
        id: eventId,
        name: events[eventId].displayName,
      }));
      return (
        <ListGroup.Item sm={4} key={`${row}.${col}`}>
          <p>Turn {turn + 1}:</p>
          <Multiselect
            id={`${turn}.events`}
            selectedValues={selectedValues}
            onSelect={(l)=>scheduleUpdater(turn, l)}
            onRemove={(l)=>scheduleUpdater(turn, l)}
            options={options}
            displayValue="name"
          />
        </ListGroup.Item>
      );
    });
    return (
      <ListGroup horizontal={"lg"} key={row}>
        {cols}
      </ListGroup>
    );
  });
  return <div id="schedule-editor">
    {rows}
  </div>;
}

function TestChanges(props) {
  const {
    saveFiles,
    updateSaveFiles,
  } = props;
  const {
    actions,
    events,
    schedule,
  } = useContext(GameContext);
  const history = useHistory();
  const [newSaveFileName, updateNewSaveFileName] = useState("Some Name");
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
    history.push(`/editor/${saveId}`);
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
  const { saveId } = props.match.params || 0;
  const [ actions, updateActions ] = useState({...Actions});
  const [ events, updateEvents ] = useState({...Events});
  const [ schedule, updateSchedule ] = useState({...INITIAL_SCHEDULE});
  const [ saveFiles, updateSaveFiles ] = useState({});
  useEffect(() => {
    const json = localStorage.getItem("saveFiles");
    const knownSaves = JSON.parse(json);
    if (knownSaves) {
      updateSaveFiles(knownSaves);
    }
    // TODO: Rewire this.
    // To avoid having to rewire all the default text-fields, just assume a page refresh.
    if (knownSaves[saveId]) {
      alert("Loaded save file: " + saveId);
      const currentSave = knownSaves[saveId]
      updateActions(PatchDisplayNames(currentSave.actions));
      updateEvents(currentSave.events);
      updateSchedule(currentSave.schedule);
    }
  }, [saveId]);
  useEffect(() => {
    if (saveFiles) {
      const json = JSON.stringify(saveFiles);
      localStorage.setItem("saveFiles", json);
    }
  }, [saveFiles]);
  return (
    <GameContext.Provider value={{
      actions: actions, updateActions: updateActions,
      events: events, updateEvents: updateEvents,
      schedule: schedule, updateSchedule: updateSchedule,
      saveId: saveId,
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
          <TestChanges saveFiles={saveFiles} updateSaveFiles={updateSaveFiles} />
        </Tab>
      </Tabs>
    </GameContext.Provider>
  );
}

export default GameEditor;

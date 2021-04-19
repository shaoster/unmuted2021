import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Button,
  Col,
  Form,
  ListGroup,
  Modal,
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
import {
  BaseAction,
} from "../Action";
import { BaseEvent } from "../Event";
import LocalStorageContext from "../LocalStorageContext";

// Cute hack from https://gist.github.com/mattwiebe/1005915
function unCamelCase(input){return input.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/\b([A-Z]+)([A-Z])([a-z])/,'$1 $2$3').replace(/^./,function(s){return s.toUpperCase();})}

function EntityEditor(props) {
  const { actionId, eventId } = props;
  const {
    actions, setActions,
    events, setEvents,
  } = useContext(LocalStorageContext);
  const entityId = actionId ? actionId : eventId;
  const entity = actionId ? actions[actionId] : events[eventId];
  console.log(actions);
  console.log(entity);
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
      const updateEntities = actionId ? setActions : setEvents;
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
    setActions,
  } = useContext(LocalStorageContext);
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
    setActions(updatedActions);
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
    setEvents,
  } = useContext(LocalStorageContext);
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
    setEvents(updatedEvents);
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
    setSchedule,
    events,
  } = useContext(LocalStorageContext);
  const scheduleUpdater = (turn, updatedEvents) => {
    setSchedule({
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

function ImportButton(props) {
  const { dispatch } = props;
  const [showImport, setShowImport] = useState(false);
  const [newSaveFileName, setNewSaveFileName] = useState("<UNKNOWN>");
  const [newSaveData, setNewSaveData] = useState(null);
  const [newSaveDataRaw, setNewSaveDataRaw] = useState("");
  const [dataErrors, setDataErrors] = useState("Please paste your data.");
  const importSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (newSaveData) {
      dispatch({
        type: "new-save",
        saveFile: newSaveData
      });
      setShowImport(false);
    }
  };
  const validateData = (evt) => {
    setNewSaveDataRaw(evt.target.value)
  };
  const doValidate = (rawSaveData) => {
    try {
      const parsedData = JSON.parse(rawSaveData);
      if (!parsedData.name) {
        throw new Error("Could not parse save file name.");
      }
      if (!parsedData.actions) {
        throw new Error("Could not parse actions.");
      }
      if (!parsedData.events) {
        throw new Error("Could not parse events.");
      }
      if (!parsedData.schedule) {
        throw new Error("Could not parse schedule.");
      }
      setNewSaveFileName(parsedData.name);
      setNewSaveData(parsedData);
      setDataErrors(null);
    } catch (error) {
      setNewSaveFileName("<UNKNOWN>");
      setNewSaveData(null);
      setDataErrors(error.toString());
    }
  }
  useEffect(()=> {
    doValidate(newSaveDataRaw);
  }, [newSaveDataRaw]);
  return (
    <>
      <Button onClick={()=>setShowImport(true)}>Import</Button>
      <Modal
        size="lg"
        show={showImport}
        onHide={() => setShowImport(false)}
        backdrop="static"
        keyboard={false}
      >
        <Form noValidate onSubmit={importSave}>
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="import-name">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" value={newSaveFileName} required disabled/>
            </Form.Group>
            <Form.Group controlId="import-data">
              <Form.Label>Data:</Form.Label>
              <Form.Control
                as="textarea"
                rows={16}
                value={newSaveDataRaw}
                onChange={validateData}
                placeholder="Paste your data here."
                isValid={dataErrors === null}
                isInvalid={dataErrors !== null}
              />
              <Form.Control.Feedback type={dataErrors ? "invalid" : "valid"}>
                {dataErrors}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowImport(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={newSaveData === null}>Import Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

function TestChanges(props) {
  const {
    saveId,
  } = props;
  const handleSave = (state, action) => {
    switch (action.type) {
      case "load-all":
        return action.saveFiles;
      case "new-save":
        const newSaveId = Object.keys(state).length;
        return {
          ...state,
          [newSaveId]: {
            ...action.saveFile,
            timestamp: Date.now(),
          }
        };
      default:
        throw new Error(`Unrecognized action type: ${action.type}`);
    }
  };
  const [ saveFiles, dispatch ] = useReducer(handleSave, {});
  useEffect(() => {
    const json = localStorage.getItem("saveFiles");
    const knownSaves = JSON.parse(json);
    if (knownSaves) {
      dispatch({
        type: "load-all",
        saveFiles: knownSaves
      });
    }
  }, [saveId]);
  useEffect(() => {
    if (Object.keys(saveFiles).length > 0) {
      const json = JSON.stringify(saveFiles);
      localStorage.setItem("saveFiles", json);
    }
  }, [saveFiles]);
  const {
    actions,
    events,
    schedule,
  } = useContext(LocalStorageContext);
  const [newSaveFileName, updateNewSaveFileName] = useState("Some Name");
  const newSave = () => {
    dispatch({
      type: "new-save",
      saveFile: {
        name: newSaveFileName,
        actions: actions,
        events: events,
        schedule: schedule,
      }
    });
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
      <td>
        <Button onClick={newSave}>Save Current</Button>&nbsp;
        <ImportButton dispatch={dispatch}/>
      </td>
      <td><Button disabled>Save to export</Button></td>
      <td>Save to launch</td>
    </tr>
  );
  const generateRow = (saveId, name, timestamp) => (
    <tr key={`save-${saveId}`}>
      <td>{saveId}</td>
      <td>{name}</td>
      <td>{timestamp ? new Date(timestamp).toLocaleString() : "N/A"}</td>
      <td><Link to={`/${saveId}/edit`}><Button>Load</Button></Link></td>
      <td><Button onClick={()=>doCopy(saveId)}>Copy to Clipboard</Button></td>
      <td><Link to={`/${saveId}/game`} target="_blank"><Button>Launch Game</Button></Link></td>
    </tr>
  );
  const saveRows = Object.entries(saveFiles).map(([saveId, saveFile]) => (
    generateRow(saveId, saveFile.name, saveFile.timestamp)
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
        {generateRow("static", "Hard Coded Configuration", null)}
      </tbody>
    </Table>
  );
}

function GameEditor(props) {
  const { saveId } = props;
  const localStorageContext = useContext(LocalStorageContext);
  const {
    actions,
    setActions,
    events,
    setEvents,
    schedule,
    setSchedule,
    isDebug,
    setIsDebug,
    ...remainder
  } = localStorageContext;
  // We need to store dirty copies of the game configuration to avoid reloading
  // whenever we edit anything.
  // TODO: Migrate this to redux.
  const [editedActions, setEditedActions] = useState(actions);
  const [editedEvents, setEditedEvents] = useState(events);
  const [editedSchedule, setEditedSchedule] = useState(schedule);
  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    if (editedActions === actions &&
        editedEvents === events &&
        editedSchedule === schedule
    ) {
      setIsDirty(false);
    } else {
      setIsDirty(true);
    }
  }, [actions, editedActions, events, editedEvents, schedule, editedSchedule]);

  useEffect(() => {
    // No point in having debug mode on for the editor.
    if (isDebug) {
      setIsDebug(false);
    }
  }, [isDebug, setIsDebug]);
  return (
    <LocalStorageContext.Provider value={{
      actions: editedActions,
      setActions: setEditedActions,
      events: editedEvents,
      setEvents: setEditedEvents,
      schedule: editedSchedule,
      setSchedule: setEditedSchedule,
      saveId: saveId,
      ...remainder
    }}>
      <Tabs id="editor-root" defaultActiveKey="actions">
        <Tab disabled title={isDirty ? "Unsaved Changes" : `Save Slot: ${saveId}`}>
        </Tab>
        <Tab eventKey="actions" title="Actions" key="edit-actions">
          <GameContext.Provider value={{
            // We need to override the locally edited actions in order for
            // linked card previes (e.g. from "Gain") to be up-to-date.
            actions: editedActions,
          }}>
            <ActionsTab/>
          </GameContext.Provider>
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
    </LocalStorageContext.Provider>
  );
}

export default GameEditor;

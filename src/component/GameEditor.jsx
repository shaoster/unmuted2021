import React, {
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
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";

import GameContext from "../GameContext";
import { ActionCard } from "./ActionArea";
import Actions, { BaseAction } from "../Action";
import Events from "../Event";

// Cute hack from https://gist.github.com/mattwiebe/1005915
function unCamelCase(input){return input.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/\b([A-Z]+)([A-Z])([a-z])/,'$1 $2$3').replace(/^./,function(s){return s.toUpperCase();})}


function CardEditor(props) {
  const { actionId, actions, updateActions } = props;
  const action = actions[actionId];
  const updaters = {};
  for (let field of Object.keys(action)) {
    updaters[field] = _.debounce((e) => {
      const oldValue = actions[actionId][field];
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
          if (e.target.value === "") {
            newValue = [];
          } else {
            let maybeIndex = oldValue.indexOf(e.target.value);
            if (maybeIndex < 0) {
              newValue = [...oldValue, e.target.value];
            } else {
              newValue = [...oldValue];
              newValue.splice(maybeIndex, 1);
            }
          }
          break;
        default:
          throw new Error(`Don't know how to serialize ${field} for value ${e.target.value}`);
      }
      const updatedActions = {
        ...actions,
        ...{
          [actionId]: {
            ...actions[actionId],
            [field]: newValue
          }
        }
      };
      updateActions(updatedActions);
    }, 300);
  }
  const formGroups = Object.entries(action)
    .filter(([field, value]) => (
      value !== null &&
      typeof(value) !== "function" &&
      field !== "id"
    ))
    .map(([field, value]) => {
      let input;
      switch (typeof(value)) {
        case "string":
          input = (
            <Form.Control
              type="text"
              defaultValue={action[field]}
              onChange={updaters[field]}
            />
          );
          break;
        case "number":
          input = (
            <Form.Control
              type="range"
              defaultValue={action[field]}
              max={10}
              onChange={updaters[field]}
            />
          );
          break;
        case "boolean":
          input = (
            <Form.Check
              type="checkbox"
              defaultValue={action[field]}
              onChange={updaters[field]}
            />
          );
          break;
        case "object":
          input = (
            <Form.Control
              as="select"
              onChange={updaters[field]}
              value={action.gainsCards}
              multiple
            >
              {
                Object.keys(actions).map((actionId) =>
                  <option key={actionId}>
                    {actionId}
                  </option>
                ) 
              }
            </Form.Control>
          );
          break;
        default:
          throw new Error(`Unrecognized value type ${value} for ${field}.`);
      }
      return (
        <Form.Group as={Row} key={`edit-${field}`} controlId={`${actionId}.${field}`}>
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
  } = props;
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
      <CardEditor actionId={id} actions={actions} updateActions={updateActions}/>
    </Tab.Pane>
  ));
  const newAction = () => {
    const newActionId = "Card" + (Object.keys(actions).length + 1);
    const updatedAction = {
      ...actions,
      [newActionId] : {
        ...BaseAction,
        id: newActionId,
        displayName: newActionId,
      }
    };
    updateActions(updatedAction);
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

function TestChanges(props) {
  const {
    actions,
    updateActions,
    events,
    updateEvents,
    schedule,
    updateSchedule,
  } = props;
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
    console.log(newSave);
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
  const [ schedule, updateSchedule ] = useState({});
  return (
    <GameContext.Provider value={{
      actions: actions,
    }}>
      <Tabs id="editor-root" defaultActiveKey="actions">
        <Tab eventKey="actions" title="Actions" key="edit-actions">
          <ActionsTab actions={actions} updateActions={updateActions} />
        </Tab>
        <Tab eventKey="events" title="Events" key="edit-events">
        </Tab>
        <Tab eventKey="schedule" title="Schedule" key="edit-schedule">
        </Tab>
        <Tab eventKey="test" title="Test Changes" key="test">
          <TestChanges
            actions={actions} updateActions={updateActions}
            events={events} updateEvents={updateEvents}
            schedule={schedule} updateSchedule={updateSchedule}
          />
        </Tab>
      </Tabs>
    </GameContext.Provider>
  );
}

export default GameEditor;

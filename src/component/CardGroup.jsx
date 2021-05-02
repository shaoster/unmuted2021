import React, {
  useState,
} from "react";

import {
  CSSTransition,
  TransitionGroup,
} from "react-transition-group";

import {
  Badge,
  ListGroup,
  Pagination,
} from "react-bootstrap";

const _ = require("lodash");

function Paginated(props) {
  const {
    children,
    ...remainingProps
  } = props;
  const [ currentPageIndex, setCurrentPageIndex ] = useState(0);
  const navs = (
    <Pagination>
      {
        children.map((child, index) => (
          <Pagination.Item
            key={index + 1}
            active={index===currentPageIndex}
            onClick={()=>setCurrentPageIndex(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))
      }
    </Pagination>
  );
  return <div {...remainingProps}>
    {children[currentPageIndex]}
    {navs}
  </div>;
}

function MaybeAnimatedListGroup({children, isAnimated}) {
  let content;
  if (isAnimated) {
    content = (
      <TransitionGroup component={null}>
        {
          children.map((child) =>
            (
              <CSSTransition
                key={child.key}
                appear={true}
                enter={true}
                exit={true}
                classNames="action-card"
                timeout={300}
              >
                {child}
              </CSSTransition>
            )
          )
        }
      </TransitionGroup>
    );
  } else {
    content = children;
  }
  return <ListGroup horizontal className="card-row">
    {content}
  </ListGroup>;
}

export function CardGroup(props) {
  const {
    label,
    maxColumns,
    maxRows,
    children,
    isAnimated,
    ...remainingProps
  } = props;
  const rows = _.chunk(children, (maxColumns || 4));
  const pages = _.chunk(rows, (maxRows || 1));
  const listGroups = pages.map((childPage, pageIndex) => <div key={pageIndex}>
    {
      childPage.map((childRow, rowIndex) => (
          <MaybeAnimatedListGroup isAnimated={isAnimated} key={rowIndex}>
            {
              childRow.map((child) => (
                <ListGroup.Item key={child.key}>
                  {child}
                </ListGroup.Item>
              ))
            }
          </MaybeAnimatedListGroup>
      ))
    }
  </div>);
  return <div {...remainingProps}>
    {children.length > 0 && label && <p><Badge>{label}</Badge></p> }
    {
      rows.length > (maxRows || 1) ?
        <Paginated>{listGroups}</Paginated> : listGroups
    }
  </div>;
}

export default CardGroup;

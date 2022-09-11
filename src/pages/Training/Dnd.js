import React from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';

function Dnd() {
  const list = [
    {
      id: 1,
      title: 'Read some news',
    },
    {
      id: 2,
      title: 'Go out for a walk',
    },
    {
      id: 3,
      title: 'Do some exercise',
    },
    {
      id: 4,
      title: 'Watch tutorials on YouTube',
    },
    {
      id: 5,
      title: 'Netflix and chill',
    },
    {
      id: 6,
      title: 'Read a book',
    },
  ];

  return (
    <>
      <DragDropContext
        onDragEnd={(param) => {
          const srcI = param.source.index;
          const desI = param.destination?.index;
          if (desI) {
            list.splice(desI, 0, list.splice(srcI, 1)[0]);
          }
        }}
      >
        <h1>The List</h1>
        <Droppable droppableId="droppable-1">
          {(provided, _) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.map((item, i) => (
                <Draggable key={item.id} draggableId={'draggable-' + item.id} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        boxShadow: snapshot.isDragging ? '0 0 .4rem #666' : 'none',
                      }}
                    >
                      <div>{item.title}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default Dnd;

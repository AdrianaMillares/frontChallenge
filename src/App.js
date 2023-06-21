import React, { useRef, useState } from "react";
import Moveable from "react-moveable";
import { BsTrash } from "react-icons/bs";
import "./styles.css";

/**
 * @function App 
 * @description Genera toda la logica de movimiento y re escalamiento de las figuras
 * @returns {React.Component}
 */

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  /**
   * @function addMoveable
   * @description Añade nuevas figuras en el contenedor
   * @param COLORS {String} es un listado de colores
   * @param newMoveable nueva figura
   */
  const addMoveable = () => {
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    const newMoveable = {
      id: Math.floor(Math.random() * Date.now()),
      top: 0,
      left: 0,
      width: 100,
      height: 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      updateEnd: true,
    };

    setMoveableComponents([...moveableComponents, newMoveable]);
  };

  /**\
   * @function updateMoveable
   * @description Llama a todas las funciones necesarias para actualizar la posicion y el 
   * tamaño de la figura 
   */
  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable) => {
      if (moveable.id === id) {
        return { ...moveable, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  /**
   * @function removeMoveable
   * @description Elimina figuras de la lista
   * @param {*} id es el identificador de la figura que deseamos eliminar
   */
  const removeMoveable = (id) => {
    const updatedMoveables = moveableComponents.filter(
      (moveable) => moveable.id !== id
    );
    setMoveableComponents(updatedMoveables);
  };

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <h1 className="titulo">Redimencionamiento de figuras</h1>
      <div className="instrucciones">
        <h3 className="instruccion">Instrucciones</h3>
        <p>
          <strong>Añadir:</strong> Da click en el botón "Add Moveable" para añadir una nueva figura
          <br />
          <strong>Seleccionar:</strong> Da click sobre la figura para seleccionarla
          <br />
          <strong>Mover:</strong> Da click en la figura y arrastrala a la posicion que prefieras
          <br />
          <strong>Ajustar:</strong> Ajusta el tamaño de la figura y arrastrando los puntos que salen a su alrededor
          <br />
          <strong>Eliminar:</strong> Elimina la figura dando click en el ícono de basurero
        </p>
      </div>
      <button className="nuevo" onClick={addMoveable}>Add Moveable</button>
      <div
        className="parent"
      >
        {moveableComponents.map((item) => (
          <Component
            key={item.id}
            {...item}
            updateMoveable={updateMoveable}
            removeMoveable={removeMoveable}
            setSelected={setSelected}
            isSelected={selected === item.id}
            containerWidth={80 * window.innerWidth * 0.01}
            containerHeight={80 * window.innerHeight * 0.01}
          />
        ))}
      </div>
    </main>
  );
};

/**
 * Se crean los parametros necesarios para manipular la figura
 * @returns nuevas dimensiones de la figura
 */
const Component = ({
  id,
  top,
  left,
  width,
  height,
  color,
  updateMoveable,
  removeMoveable,
  setSelected,
  isSelected,
  containerWidth,
  containerHeight,
}) => {
  const ref = useRef();

  const onResize = (e) => {
    const newWidth = e.width;
    const newHeight = e.height;

    const maxWidth = containerWidth - left;
    const maxHeight = containerHeight - top;

    const finalWidth = Math.min(newWidth, maxWidth);
    const finalHeight = Math.min(newHeight, maxHeight);

    updateMoveable(id, { top, left, width: finalWidth, height: finalHeight });

    ref.current.style.width = `${finalWidth}px`;
    ref.current.style.height = `${finalHeight}px`;
  };

  /**
   * @function onDrag
   * @description permite mover las figuras dentro del contenedor
   */
  const onDrag = (e) => {
    const { top, left } = e;

    const maxLeft = containerWidth - width;
    const maxTop = containerHeight - height;

    const finalLeft = Math.max(0, Math.min(left, maxLeft));
    const finalTop = Math.max(0, Math.min(top, maxTop));

    updateMoveable(id, { top: finalTop, left: finalLeft, width, height });
  };

  const handleClick = () => {
    setSelected(id);
  };

  const handleDelete = () => {
    removeMoveable(id);
  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          background: color,
        }}
        onClick={handleClick}
      >
        {isSelected && (
          <button className="delete-button" onClick={handleDelete} >
            <BsTrash />
          </button>
        )}
      </div>

      <Moveable
        target={ref.current}
        resizable
        draggable
        onDrag={onDrag}
        onResize={onResize}
        keepRatio={false}
        edge={true}
        zoom={1}
        origin={false}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};

export default App;

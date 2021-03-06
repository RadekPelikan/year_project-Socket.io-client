import { Button, Slider } from "@mui/material";
import React from "react";
import ColorPicker from "./ColorPicker";
import LayersContainer from "./LayerList";
import ToolsContainer from "./ToolsList";

const PaintToolsBar = ({
  curCanvas,
  color,
  setColor,
  layers,
  setLayers,
  activeL,
  setActiveL,
  size,
  setSize,
  activeTool,
  setActiveTool,
  prevColor,
  setPrevColor,
  editingL,
  setEditingL,
}) => {
  return (
    <>
      <ColorPicker
        id="color-picker"
        color={color}
        setColor={setColor}
        curCanvas={curCanvas}
        prevColor={prevColor}
        setPrevColor={setPrevColor}
      />
      <ToolsContainer
        activeTool={activeTool}
        setActiveTool={setActiveTool}
      />
      <Slider
        value={size}
        onChange={(event, value) => setSize(value)}
        min={1}
        max={100}
      />
      <Button
        variant="contained"
        color="success"
        onClick={() => {
          curCanvas.current.changeBg(color);
          setColor(prevColor[1]);
        }}
        sx={{ width: 1 }}
      >
        Change bg color
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={() => curCanvas.current.createLayer()}
        sx={{ width: 1 }}
      >
        add layer
      </Button>
      <LayersContainer
        layers={layers}
        setLayers={setLayers}
        activeL={activeL}
        setActiveL={setActiveL}
        curCanvas={curCanvas}
        editingL={editingL}
        setEditingL={setEditingL}
      />
    </>
  );
};

export default PaintToolsBar;

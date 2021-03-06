import React, { useContext, useEffect, useRef, useState } from "react";
import HelpMenu from "../../components/Canvas/HelpMenu";
import PaintToolsBar from "../../components/Canvas/PaintToolsBar";
import {
  Button,
  Container,
  Divider,
  Modal,
  Stack,
  Tooltip,
} from "@mui/material";
import useKeypress from "react-use-keypress";
import Canvas from "../../components/Canvas/Canvas";
import { SocketContext } from "../../Context/socket";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import UsersContainer from "../../components/Canvas/UsersContainer/UsersContainer";

const CanvasPage = ({ room, user }) => {
  const [color, setColor] = useState("#F0F0F0");
  const [prevColor, setPrevColor] = useState([color, color]);
  const [size, setSize] = useState(5);
  const [activeTool, setActiveTool] = useState("pencil");
  const [layers, setLayers] = useState([]);
  const [activeL, setActiveL] = useState(0);
  const [editingL, setEditingL] = useState(false);
  const [open, setOpen] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const [hover, setHover] = useState(false);

  const [openHelp, setOpenHelp] = useState(false);

  const curCanvas = useRef(null);
  const handleCloseHelp = () => setOpenHelp(false);

  useKeypress("p", () => editingL || setActiveTool("pencil"));
  useKeypress("e", () => editingL || setActiveTool("eraser"));
  useKeypress("b", () => editingL || setActiveTool("bucket"));

  useKeypress("n", () => {
    if (editingL) return;
    curCanvas.current.createLayer();
    setActiveL(0);
  });
  useKeypress("r", () => editingL || curCanvas.current.removeLayer());

  useKeypress("c", () => {
    if (editingL) return;
    curCanvas.current.changeBg(color);
    setColor(prevColor[1]);
  });

  useKeypress("+", () => editingL || (size < 100 && setSize(size + 5)));
  useKeypress("-", () => editingL || (size > 5 && setSize(size - 5)));

  useKeypress("F1", () => editingL || setOpenHelp(!openHelp));
  useKeypress("Escape", () => editingL || setOpenHelp(false));

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit("room:exists", { id });
    socket.on("room:user-kick", () => {
      navigate("/");
    });
    socket.emit("room:get-open", { user, room });
    socket.on("room:get-open:done", () => setAdmin(true));
    socket.on("room:switchOpen:done", ({ open }) => setOpen(open));

    socket.emit("room:get-size", { user, room });
    socket.on("room:get-size:done", ({ width, height }) => {
      setWidth(width || 1000);
      setHeight(height || 1000);
      setShowCanvas([0]);
    });
    if (!room.id) navigate("/");
  }, []);

  return (
    <>
      <Modal
        open={openHelp}
        onClose={handleCloseHelp}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <HelpMenu />
      </Modal>

      <Container className="canvas-container">
        <div className="canvas-server-info">
          {admin && (
            <>
              <Tooltip title={`Click to ${open ? "lock" : "open"}`}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    socket.emit("room:switch-open", { user, room })
                  }
                >
                  {open ? "Opened" : "Locked"}
                </Button>
              </Tooltip>

              <Divider orientation="vertical" flexItem />
            </>
          )}
          <UsersContainer room={room} user={user} />
        </div>
        <Stack direction="row" spacing={2}>
          <div className="paint-toolbar">
            <PaintToolsBar
              curCanvas={curCanvas}
              color={color}
              setColor={setColor}
              layers={layers}
              setLayers={setLayers}
              activeL={activeL}
              setActiveL={setActiveL}
              size={size}
              setSize={setSize}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              prevColor={prevColor}
              setPrevColor={setPrevColor}
              editingL={editingL}
              setEditingL={setEditingL}
            />
          </div>

          <div
            className="canvas-wrapper"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {showCanvas && (
              <Canvas
                width={width}
                height={height}
                color={color}
                layers={layers}
                setLayers={setLayers}
                activeL={activeL}
                setActiveL={setActiveL}
                size={size}
                activeTool={activeTool}
                hover={hover}
                room={room}
                user={user}
                ref={curCanvas}
              />
            )}
          </div>
        </Stack>
      </Container>
    </>
  );
};

export default CanvasPage;

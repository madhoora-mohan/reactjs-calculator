import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OprnButton from "./OprnButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPRN: "choose-oprn",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          currOp: payload.digit,
          overWrite: false,
        };
      }
      if (payload.digit === "0" && state.currOp === "0") return state;
      if (payload.digit === "." && state.currOp.includes(".")) return state;
      return {
        ...state,
        currOp: `${state.currOp || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPRN:
      if (state.currOp == null && state.prevOp == null) {
        return state;
      }

      if (state.currOp == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.prevOp == null) {
        return {
          ...state,
          oprn: payload.oprn,
          prevOp: state.currOp,
          currOp: null,
        };
      }
      return {
        ...state,
        prevOp: evaluate(state),
        oprn: payload.oprn,
        currOp: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currOp: null,
        };
      }
      if (state.currOp == null) return state;
      if (state.currOp.length === 1) {
        return { ...state, currOp: null };
      }
      return {
        ...state,
        currOp: state.currOp.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (state.oprn == null || state.currOp == null || state.prevOp == null) {
        return state;
      }
      return {
        ...state,
        overWrite: true,
        prevOp: null,
        oprn: null,
        currOp: evaluate(state),
      };
  }
}

function evaluate({ currOp, prevOp, oprn }) {
  const prev = parseFloat(prevOp);
  const current = parseFloat(currOp);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (oprn) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }

  return computation.toString();
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currOp, prevOp, oprn }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calc-grid">
      <div className="output">
        <div className="prevOp">
          {formatOperand(prevOp)} {oprn}
        </div>
        <div className="currOp">{formatOperand(currOp)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OprnButton oprn="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OprnButton oprn="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OprnButton oprn="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OprnButton oprn="-" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;

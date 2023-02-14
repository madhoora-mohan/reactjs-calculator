import { ACTIONS } from "./App";

export default function OprnButton({ dispatch, oprn }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPRN, payload: { oprn } })}
    >
      {oprn}
    </button>
  );
}

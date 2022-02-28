import { ReactElement, useContext, useState } from "react";

import AppLayout from "layouts/app";
import ToastContext from "components/Toast";

export default function ToastDesign() {
  const [num, setNum] = useState(1);
  const { addToast } = useContext(ToastContext);

  const addAToast = (type: "string" | "error", timeout?: number) => {
    addToast({ type: type, string: `A new toast #${num}` }, timeout);
    setNum(num + 1);
  };
  return (
    <div className="flex flex-col">
      <button onClick={() => addAToast("string")}>Add Toast</button>
      <button onClick={() => addAToast("error")}>Add Error Toast</button>
      <button onClick={() => addAToast("string", 6000)}>Add Long Toast</button>
    </div>
  );
}

ToastDesign.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

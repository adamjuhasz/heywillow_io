import { ReactElement, useContext, useState } from "react";

import AppLayout from "layouts/app";
import ToastContext from "components/Toast";

export default function ToastDesign() {
  const [num, setNum] = useState(1);
  const { addToast } = useContext(ToastContext);

  const addAToast = () => {
    addToast({ type: "string", string: `A new toast #${num}` });
    setNum(num + 1);
  };
  return (
    <>
      <button onClick={addAToast}>Add Toast</button>
    </>
  );
}

ToastDesign.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

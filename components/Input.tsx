import { forwardRef, useState } from "react";
import LockClosedIcon from "@heroicons/react/solid/LockClosedIcon";
import TextareaAutosize from "react-textarea-autosize";

interface Props {
  defaultValue?: string;
  submit: (_t: string) => Promise<unknown>;
  buttonText?: string;
  placeholder?: string;
}

const InputWithRef = forwardRef<HTMLDivElement, Props>(function Input(
  {
    buttonText = "Send secure message",
    placeholder = "What would you like to securely send to us?",
    ...props
  },
  ref
) {
  const [text, setText] = useState(props.defaultValue || "");
  const [inProgress, setProgress] = useState(false);

  return (
    <div ref={ref} className="flex items-start space-x-4">
      <div className=" min-w-0 flex-1">
        <form action="#" className="relative">
          <div className="overflow-hidden rounded-lg border border-zinc-600 bg-black shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <label htmlFor="comment" className="sr-only">
              {placeholder}
            </label>
            <TextareaAutosize
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-black py-3 text-zinc-100 placeholder-zinc-500 focus:ring-0 sm:text-sm"
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
              <button
                disabled={inProgress}
                onClick={async (event) => {
                  event.preventDefault();
                  setProgress(true);
                  try {
                    await props.submit(text);
                    setText("");
                  } catch (e) {
                    console.error(e);
                  }
                  setProgress(false);
                }}
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <LockClosedIcon className="mr-2 h-4 w-4" />
                {inProgress ? "Sending..." : buttonText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default InputWithRef;

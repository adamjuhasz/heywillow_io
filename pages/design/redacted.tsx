import Redacted from "components/Redacted";

export default function RedactedDesignPattern() {
  return (
    <div className="flex w-full flex-col items-center space-y-4">
      <div className=" w-32 rounded-md bg-zinc-400 p-2">
        <Redacted str={"Middle of a sentence 123-12-1234 with trailing text"} />
      </div>

      <div className=" w-72 rounded-md bg-zinc-400 p-2">
        <Redacted str={"123-12-1234 with trailing text"} />
      </div>

      <div className=" w-72 rounded-md bg-zinc-400 p-2">
        <Redacted str={"with leading text 123-12-1234"} />
      </div>

      <div className=" w-44 rounded-md bg-zinc-400 p-2">
        <Redacted str={"Middle of a sentence 123-12-1234 with trailing text"} />
      </div>

      <div className=" w-52 rounded-md bg-zinc-400 p-2">
        <Redacted str={"Middle of a sentence 123-12-1234 with trailing text"} />
      </div>

      <div className=" w-52 rounded-md bg-zinc-400 p-2">
        <Redacted
          str={"Middle of a sentence 1234-1234-1234-1234 with trailing text"}
        />
      </div>

      <div className=" w-72 rounded-md bg-zinc-400 p-2">
        <Redacted
          str={"Middle of a sentence 1234-1234-1234-1234 with trailing text"}
        />
      </div>

      <div className=" w-72 rounded-md bg-zinc-400 p-2">
        <Redacted
          str={
            "SSN is 123-12-1234 and PAN Middle of a sentence 1234-1234-1234-1234 with trailing text"
          }
        />
      </div>
    </div>
  );
}

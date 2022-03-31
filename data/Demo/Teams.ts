interface DemoTeam {
  id: number;
  name: string;
  Namespace: {
    namespace: string;
  };
}
const teams: DemoTeam[] = [
  { id: 1, name: "Stealth AI", Namespace: { namespace: "stealth" } },
];

export default teams;

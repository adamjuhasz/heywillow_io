// cspell: disable-next-line
declare module "arbit" {
  // cspell: disable-next-line
  function arbit(seed: string): {
    (): number;
    nextInt(min: number, max: number): number;
  };

  // cspell: disable-next-line
  export default arbit;
}

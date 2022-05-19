export abstract class EventMaster {
  nextId: number = 1;
  protected getNexId(): number {
    return this.nextId++;
  }
}

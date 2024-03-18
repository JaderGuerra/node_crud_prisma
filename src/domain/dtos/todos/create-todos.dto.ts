export class CreateTodosDts {
  private constructor(public readonly text: string) {}

  static create(props: { [key: string]: any }): [string?, CreateTodosDts?] {
    const { text } = props;

    if (!text) return ["Text property is required", undefined];

    return [undefined, new CreateTodosDts(text)];
  }
}

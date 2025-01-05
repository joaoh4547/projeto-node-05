import { Either, left, right } from "./either";

function doSomething(x: boolean): Either<string, number> {
    if (x) {
        return right(10);
    }
    return left("error");
}

test("success result", async () => {
    const result = doSomething(true);
    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
});

test("error result", async () => {
    const result = doSomething(false);
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
});

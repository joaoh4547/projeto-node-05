import { UniqueEntityId } from "./value-objects/unique-entity-id";

export abstract class Entity<Props> {
    private _id: UniqueEntityId;
    protected props: Props;

    get id() {
        return this._id;
    }

    protected constructor(props: Props, id?: UniqueEntityId) {
        this.props = props;
        this._id = id ?? new UniqueEntityId();
    }

    public equals(object: Entity<unknown>) {
        if (object === this) {
            return true;
        }
        if (object.id === this.id) {
            return true;
        }
        return false;
    }
}

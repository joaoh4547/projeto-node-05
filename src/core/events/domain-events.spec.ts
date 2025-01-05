import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/value-objects/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";
class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date;
    private aggregate: CustomAggregate; 

    constructor(aggregate: CustomAggregate) {
        this.aggregate = aggregate;
        this.ocurredAt = new Date();
    }

    public getAggregateId(): UniqueEntityId {
        return this.aggregate.id;
    }
}

class CustomAggregate extends AggregateRoot<null> {
    static create() {
        const aggregate = new CustomAggregate(null);

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

        return aggregate;
    }
}


describe("Domain Events", () =>{

    it("should be to dispatch and listen event",() =>{
        const spy = vi.fn();

        DomainEvents.register(spy, CustomAggregateCreated.name);
  
        const aggregate = CustomAggregate.create();
  
        expect(aggregate.domainEvents).toHaveLength(1);
        DomainEvents.dispatchEventsForAggregate(aggregate.id);
        expect(spy).toHaveBeenCalled();
        expect(aggregate.domainEvents).toHaveLength(0);

    });

});
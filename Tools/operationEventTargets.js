const loadingEventTarget = new EventTarget();
const queueEventTarget = new EventTarget();
const startGameEventTarget = new EventTarget();

const OPERATION_EVENT_TARGETS = {
    loadingEventTarget,
    queueEventTarget,
    startGameEventTarget
    
};

export default OPERATION_EVENT_TARGETS
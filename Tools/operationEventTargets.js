const loadingEventTarget = new EventTarget();
const queueEventTarget = new EventTarget();

const OPERATION_EVENT_TARGETS = {
    loadingEventTarget,
    queueEventTarget
    
};

export default OPERATION_EVENT_TARGETS
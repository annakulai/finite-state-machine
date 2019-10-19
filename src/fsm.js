class FSM {
    
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.state = config.initial;
        this.states = config.states;
        this.base = this.state;
        this.prev = null;
        this.undoStack = [];
        this.redoStack = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.states[state]) {
            throw new Error;
        }

        this.undoStack.push(this.state);
        this.redoStack = [];
        this.state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this.states[this.state].transitions[event]) { 
            throw new Error;
        }

        this.undoStack.push(this.state);
        this.redoStack = [];
        this.state = this.states[this.state].transitions[event];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        return this.state = this.base;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let stack = [];
        const transitions = Object.getOwnPropertyNames(this.states);

        if (!event) {
            return transitions;
        }

        for (let i = 0; i < transitions.length; i++) {
            if (this.states[transitions[i]].transitions[event]) {
                stack.push(transitions[i]);
            }
        }
        return stack;

    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.undoStack.length === 0) {
            return false;
        }

        this.redoStack.push(this.state);
        this.state = this.undoStack.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.redoStack.length === 0) {
            return false;
        }

        this.undoStack.push(this.state);
        this.state = this.redoStack.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
       this.undoStack = [];
       this.redoStack = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

class KeyboardInputData
{
    #user;
    #phrase;
    #keysSequence;
    #startTime;

    constructor(user, phrase){
        this.#user = user;
        this.#phrase = phrase;
        this.#keysSequence = [];
    }

    RegisterStartTime(startTime){
        this.#startTime = startTime;
    }

    RegisterKeyDown(key, time){
        if(!this.#startTime){
            this.RegisterStartTime(time);
        }

        time = this.#GlobalTimeToRelativeTime(time);

        for(let i = this.#keysSequence.length - 1; i >= 0; --i){
            if(this.#keysSequence[i].key == key && !this.#keysSequence[i].keyUpTime){
                return;
            }
        }

        this.#keysSequence.push({
            key: key,
            keyDownTime: time,
            keyUpTime: undefined
        })
    }

    RegisterKeyUp(key, time){
        time = this.#GlobalTimeToRelativeTime(time);
        for(let i = this.#keysSequence.length - 1; i >= 0; --i){
            if(this.#keysSequence[i].key == key){
                this.#keysSequence[i].keyUpTime = time;
                break;
            }
        }
    }

    GetKeysSequence(){
        return this.#keysSequence;
    }

    GetAsSerializableObject(){
        return {
            user: this.#user,
            phrase: this.#phrase,
            sequence: this.#keysSequence,
        }
    }

    #GlobalTimeToRelativeTime(localTime){
        return localTime - this.#startTime;
    }

};

export default KeyboardInputData;
import * as Joi from 'joi'

const schema = Joi.object({
    id: Joi.any(),
    
    user: Joi.string()
        .required(),

    phrase: Joi.string()
        .required(),

    finishDate: Joi.number()
        .required(),

    sequence: Joi.array()
        .items(Joi.object({
            key: Joi.string().required(),
            keyDownTime: Joi.number().required(),
            keyUpTime: Joi.number(),
            cursorPosition: Joi.number()
        }))
        .required(),

});



export function deserializeInputData(serialzied){
    const deserialzitionInfo = {
        found_obj_count: 0,
        correct_obj_count: 0,
        incorrect_obj_count: 0,
        correct_obj: []
    };

    try{
        const obj = JSON.parse(serialzied);
        if(Array.isArray(obj)){
            deserialzitionInfo.found_obj_count = obj.length;
            obj.forEach(o => {

                if(!o.finishDate) o.finishDate = 0; //for backwards compatibility

                if(isValid(o)){
                    deserialzitionInfo.correct_obj_count++;
                    deserialzitionInfo.correct_obj.push(o);
                }
                else{
                    deserialzitionInfo.incorrect_obj_count++;
                }
            });
        }
        else{

            if(!obj.finishDate) obj.finishDate = 0; //for backwards compatibility

            deserialzitionInfo.found_obj_count = 1;
            if(isValid(obj)){
                deserialzitionInfo.correct_obj_count = 1;
                deserialzitionInfo.correct_obj = [obj];
            }
            else{
                deserialzitionInfo.incorrect_obj_count = 1;
            }
        }

        return deserialzitionInfo;
    }
    catch(error){
        console.log("error");
        return deserialzitionInfo;
    }
    
}

function isValid(obj){
    const validation =schema.validate(obj);
    console.log(validation);
    if(validation.error){
        return false;
    }
    return true;
}
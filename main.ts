//  NOTES:
//  1 is left and back, 0 is right and front
//  Black magic don't touch
pins.setPull(DigitalPin.P20, PinPullMode.PullUp)
//  Utility
//  Turn left or right ROUGHLY 90 degrees
function turn(direction: number) {
    let ir1_read: number;
    let ir2_read: number;
    let counter1 = 0
    let counter2 = 0
    while (true) {
        basic.showNumber(counter1)
        sensors.DDMmotor(gb1_direction, direction, gb1_speed, turn_speed + turn_speed_offset1)
        sensors.DDMmotor(gb2_direction, direction, gb2_speed, turn_speed + turn_speed_offset2)
        basic.pause(200)
        stop()
        ir1_read = pins.digitalReadPin(ir1)
        ir2_read = pins.digitalReadPin(ir2)
        if (counter1 + counter2 >= 4 && !ir1_read && !ir2_read) {
            stop()
            break
        }
        
        if (ir1_read == 0 && counter1 == 0) {
            counter1 = 1
        } else if (ir1_read == 1 && counter1 == 1) {
            counter1 = 2
        }
        
        if (ir2_read == 0 && counter2 == 0) {
            counter2 = 1
        } else if (ir2_read == 1 && counter2 == 1) {
            counter2 = 2
        }
        
    }
}

//  Adjust angle so that the car is straight
function adjust_angle(direction: number) {
    while (pins.digitalReadPin(ir1) == direction && pins.digitalReadPin(ir2) == 1 - direction) {
        sensors.DDMmotor(gb1_direction, direction, gb1_speed, turn_speed + turn_speed_offset1)
        sensors.DDMmotor(gb2_direction, direction, gb2_speed, turn_speed + turn_speed_offset2)
    }
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
}

function move(direction: number, cycles: number = 100) {
    let elapsed = 0
    while (elapsed <= cycles) {
        sensors.DDMmotor(gb1_direction, direction, gb1_speed, speed + speed_offset1)
        sensors.DDMmotor(gb2_direction, 1 - direction, gb2_speed, speed + speed_offset2)
        elapsed += 1
        //  Car is angled too far to the right
        if (pins.digitalReadPin(ir1) == 1 && pins.digitalReadPin(ir2) == 0) {
            stop()
            adjust_angle(1 - direction)
        }
        
        //  Car is angled too far to the left
        if (pins.digitalReadPin(ir1) == 0 && pins.digitalReadPin(ir2) == 1) {
            stop()
            adjust_angle(direction)
        }
        
        basic.pause(1)
    }
    stop()
}

function stop() {
    sensors.DDMmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.DDMmotor(gb2_direction, 0, gb2_speed, 0)
}

//  For each intersection
function first() {
    stop()
    turn(1)
    basic.pause(2000)
    move(0, 200)
    stop()
    move(1, 400)
    move(0, 400)
    stop()
    turn(0)
}

//  Pins
let force = DigitalPin.P20
let ir1 = DigitalPin.P1
let ir2 = DigitalPin.P8
let gb1_speed = AnalogPin.P14
let gb1_direction = AnalogPin.P13
let gb2_speed = AnalogPin.P16
let gb2_direction = AnalogPin.P15
//  Speeds and offsets incase one side is faster then the other (they are)
let speed = 100
let speed_offset1 = 0
let speed_offset2 = 0
let turn_speed = 250
let turn_speed_offset1 = 0
let turn_speed_offset2 = 0
let active = false
//  Keep track of how many intersections the car has passed
let intersectionCount = 0
while (true) {
    if (pins.digitalReadPin(force) == 0 && !active) {
        active = true
    }
    
    if (active) {
        //  Move forward a little bit
        move(0, 5)
        //  If both sensors detect black then it is an intersection
        if (pins.digitalReadPin(ir1) == 1 && pins.digitalReadPin(ir2) == 1) {
            intersectionCount += 1
            if (intersectionCount == 1) {
                first()
            } else if (intersectionCount == 2) {
                
            } else if (intersectionCount == 3) {
                //  second()
                
            } else if (intersectionCount == 4) {
                //  second()
                
            } else if (intersectionCount == 5) {
                //  third()
                //  Last intersection so we're done
                //  fourth()
                break
            }
            
        }
        
    }
    
}

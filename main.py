# NOTES:
# 1 is left and back, 0 is right and front

# Black magic don't touch
pins.set_pull(DigitalPin.P20, PinPullMode.PULL_UP)

# Utility
# Turn left or right ROUGHLY 90 degrees
def turn(direction : number):
    counter1 = 0
    counter2 = 0

    while True:

        basic.show_number(counter1)

        sensors.dd_mmotor(gb1_direction, direction, gb1_speed, turn_speed + turn_speed_offset1)
        sensors.dd_mmotor(gb2_direction, direction, gb2_speed, turn_speed + turn_speed_offset2)

        basic.pause(200)
        stop()

        ir1_read = pins.digital_read_pin(ir1)
        ir2_read = pins.digital_read_pin(ir2)

        if (counter1 + counter2 >= 4 and not ir1_read and not ir2_read):
            stop()
            break

        if ir1_read == 0 and counter1 == 0:
            counter1 = 1

        elif ir1_read == 1 and counter1 == 1:
            counter1 = 2

        if ir2_read == 0 and counter2 == 0:
            counter2 = 1

        elif ir2_read == 1 and counter2 == 1:
            counter2 = 2

# Adjust angle so that the car is straight
def adjust_angle(direction : number):
    while (pins.digital_read_pin(ir1) == direction and pins.digital_read_pin(ir2) == 1 - direction):
        sensors.dd_mmotor(gb1_direction, direction, gb1_speed, turn_speed + turn_speed_offset1)
        sensors.dd_mmotor(gb2_direction, direction, gb2_speed, turn_speed + turn_speed_offset2)

    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)

def move(direction : number, cycles : number = 100):

    elapsed = 0

    while elapsed <= cycles:
        sensors.dd_mmotor(gb1_direction, direction, gb1_speed, speed + speed_offset1)
        sensors.dd_mmotor(gb2_direction, 1 - direction, gb2_speed, speed + speed_offset2)
        
        elapsed += 1

        # Car is angled too far to the right
        if (pins.digital_read_pin(ir1) == 1 and pins.digital_read_pin(ir2) == 0):
            stop()
            adjust_angle(1 - direction)

        # Car is angled too far to the left
        if (pins.digital_read_pin(ir1) == 0 and pins.digital_read_pin(ir2) == 1):
            stop()
            adjust_angle(direction)

        basic.pause(1)

    stop()

def stop():
    sensors.dd_mmotor(gb1_direction, 0, gb1_speed, 0)
    sensors.dd_mmotor(gb2_direction, 0, gb2_speed, 0)

# For each intersection
def first():
    stop()
    turn(1)

    basic.pause(2000)

    move(0, 200)

    stop()
    move(1, 400)

    move(0, 400)

    stop()

    turn(0)

# Pins
force = DigitalPin.P20

ir1 = DigitalPin.P1
ir2 = DigitalPin.P8

gb1_speed = AnalogPin.P14
gb1_direction = AnalogPin.P13

gb2_speed = AnalogPin.P16
gb2_direction = AnalogPin.P15

# Speeds and offsets incase one side is faster then the other (they are)
speed = 100
speed_offset1 = 0
speed_offset2 = 0

turn_speed = 250
turn_speed_offset1 = 0
turn_speed_offset2 = 0

active = False

# Keep track of how many intersections the car has passed
intersectionCount = 0

while True:

    if (pins.digital_read_pin(force) == 0 and not active):
        active = True

    if (active):
        # Move forward a little bit
        move(0, 5)
        # If both sensors detect black then it is an intersection
        if (pins.digital_read_pin(ir1) == 1 and pins.digital_read_pin(ir2) == 1):
            intersectionCount += 1

            if (intersectionCount == 1):
                first()
            
            elif (intersectionCount == 2):
                pass
                # second()
        
            elif (intersectionCount == 3):
                pass
                # second()

            elif (intersectionCount == 4):
                pass
                # third()

            # Last intersection so we're done
            elif (intersectionCount == 5):
                # fourth()
                break

# Kyntex Tendon Stiffness Monitor

Embedded prototype for estimating relative patellar tendon stiffness using controlled mechanical excitation, synchronized accelerometer acquisition, BLE streaming, and signal-processing validation.

## System Architecture

MCU → Actuator Driver → Piezo/Tapper  
MCU → SPI ADC → Accelerometers  
MCU → BLE → Python/App Dashboard

## Engineering Focus

- nRF54L15 firmware
- Zephyr RTOS
- SPI ADC driver
- synchronized sampling
- actuator timing
- BLE GATT data transfer
- validation plots# Kyntex-Technical

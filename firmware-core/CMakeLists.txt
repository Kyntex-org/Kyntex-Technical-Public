cmake_minimum_required(VERSION 3.20)
project(kyntex_firmware_core C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_EXTENSIONS OFF)

add_library(kyntex_firmware_sample
    src/band_session.c
    src/motion_features.c
    src/telemetry.c
)
target_include_directories(kyntex_firmware_sample PUBLIC include)

if(MSVC)
    target_compile_options(kyntex_firmware_sample PRIVATE /W4 /WX)
else()
    target_compile_options(kyntex_firmware_sample PRIVATE -Wall -Wextra -Wpedantic -Werror)
    target_link_libraries(kyntex_firmware_sample PUBLIC m)
endif()

add_executable(kyntex_firmware_tests tests/test_firmware.c)
target_link_libraries(kyntex_firmware_tests PRIVATE kyntex_firmware_sample)
if(MSVC)
    target_compile_options(kyntex_firmware_tests PRIVATE /W4 /WX)
else()
    target_compile_options(kyntex_firmware_tests PRIVATE -Wall -Wextra -Wpedantic -Werror)
endif()

enable_testing()
add_test(NAME kyntex_firmware_tests COMMAND kyntex_firmware_tests)

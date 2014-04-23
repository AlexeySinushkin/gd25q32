#ifndef __SHTMGR_H
#define __SHTMGR_H

#ifdef __cplusplus
 extern "C" {
#endif 

#include "stm32f10x_gpio.h"
#define Shut_Min 30
#define Shut_Max 190

#define Shut_I 35
#define Shut_II 128
#define Shut_III 190

   
void vTaskShutterManager(void *pvParameters);
void SetShutter(u16 deg);
   
#ifdef __cplusplus
}
#endif



#endif /* __SHTMGR_H*/   
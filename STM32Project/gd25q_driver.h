#ifndef __GD25QDRIVER_H
#define __GD25QDRIVER_H

#ifdef __cplusplus
 extern "C" {
#endif 

#include "common.h"
extern void GD_WritePage(u32 address, u8* data);
extern void GD_ReadPage(u32 address, u8* result);
extern void GD_WriteEnable();
extern u8 GD_GetStatusLow();
extern u8 GD_GetStatusHigh();


#ifdef __cplusplus
}
#endif



#endif /* __GD25QDRIVER_H*/   
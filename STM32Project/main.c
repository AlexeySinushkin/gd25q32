

// подключаем библиотеку CMSIS
#include "stm32f10x.h"
#include "gd25q_driver.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_rcc.h"
#include "misc.h"
#include "stm32f10x_spi.h"
#include "stm32f10x_usart.h"


GPIO_InitTypeDef  GPIO_InitStructure;

void RCC_Config()
{
  /* Enable GPIOx Clock 
  RCC_APB1PeriphClockCmd(RCC_APB1Periph_PWR, ENABLE);*/
  
  /* Enable the GPIO_LED Clock */
  RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA | RCC_APB2Periph_GPIOB | 
						 RCC_APB2Periph_GPIOC | RCC_APB2Periph_SPI1 |
						 RCC_APB2Periph_AFIO | RCC_APB2Periph_ADC1, ENABLE);
    
  
  /* Setup SysTick Timer for 1 msec interrupts  */
  if (SysTick_Config(SystemCoreClock / 1000))
  { 
    /* Capture error */ 
    while (1);
  }

  /* Enable access to the backup register => LSE can be enabled */
  PWR_BackupAccessCmd(ENABLE);
  
  /* Enable LSE (Low Speed External Oscillation) */
  RCC_LSEConfig(RCC_LSE_ON);  
}

void delay(void)
{
 u16 i=0;
 for (i=0; i<1000; i++){
   
 }
}  


 u8 GD_StateLow;
//u8 tmpBuf[256];
u8 GD_Page1[256];
u8 GD_Page2[256];
u8 GD_Page3[256];
int main()
{
  /*RCC_Config();
  
    //Configure the GPIO_LED pin 
  GPIO_InitStructure.GPIO_Pin =  GPIO_Pin_9;// ((uint16_t)0x0200) LED3_PIN GPIO_PIN[0]
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
  GPIO_Init(GPIOC, &GPIO_InitStructure); //GPIO_PORT[Led] LED3_GPIO_PORT
  //в итоге имеем девятый пин на порту С на выход

  GPIOC->BRR=GPIO_Pin_9;
*/
  
  GD_Init();
  GD_WriteEnable();
  GD_StateLow = GD_GetStatusHigh();
  GD_StateLow = GD_GetStatusLow();
  u16 i=0;  
  
  /*

  for (i=0;i<256;i++){
    tmpBuf[i]=i;
  }

  GD_ReadPage(0x00, &tmpBuf[0]);*/
 
 
  //GD_ReadPage(0x23800, &GD_Page1[0]);
  GD_ReadPage(0x800, &GD_Page1[0]);
  /* 
  while (i==0);
  delay();
  GD_WriteEnable();
    GD_StateLow = GD_GetStatusLow();  
  GD_WritePage(0x23800, &GD_Page1[0]);
    GD_StateLow = GD_GetStatusLow();
  
  delay();
  GD_WriteEnable();
  GD_WritePage(0x23900, &GD_Page2[0]);
    GD_StateLow = GD_GetStatusLow();
    
  delay();
  GD_WriteEnable();    
  GD_WritePage(0x23A00, &GD_Page3[0]);
    GD_StateLow = GD_GetStatusLow();
 */

  
  while (1){
    u8 i=0;
    i++;
    if (i==10)break;
  }
  return 0;
}




 
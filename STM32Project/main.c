

// подключаем библиотеку CMSIS
#include "stm32f10x.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_rcc.h"
#include "misc.h"

// Подключаем FreeRTOS
//#include "FreeRTOS.h"
// из всех возможностей используем пока только переключение задач
//#include "task.h"


GPIO_InitTypeDef  GPIO_InitStructure;

void RCC_Config()
{
  /* Enable GPIOx Clock */
  RCC_APB1PeriphClockCmd(RCC_APB1Periph_PWR, ENABLE);
  
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

int main()
{
  RCC_Config();
  
    //Configure the GPIO_LED pin 
  GPIO_InitStructure.GPIO_Pin =  GPIO_Pin_9;// ((uint16_t)0x0200) LED3_PIN GPIO_PIN[0]
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
  GPIO_Init(GPIOC, &GPIO_InitStructure); //GPIO_PORT[Led] LED3_GPIO_PORT
  //в итоге имеем девятый пин на порту С на выход

  GPIOC->BRR=GPIO_Pin_9;

  while (1){
    u8 i=0;
    i++;
    if (i==10)break;
  }
  return 0;
}

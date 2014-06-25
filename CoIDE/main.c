#include "stm32f10x.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_rcc.h"
#include <CoOs.h>

#include "common.h"
#include "gd25q_driver.h"


#define TASK_STK_SIZE		  128	 		      /*!< Define stack size.					      */
OS_STK   task_init_Stk[TASK_STK_SIZE];	 	  /*!< Stack of 'task_init' task.		*/
void task_init    	(void *pdata);	  /*!< Initialization task.               */


void RCC_Config()
{
  /* Enable GPIOx Clock */
  RCC_APB1PeriphClockCmd(RCC_APB1Periph_PWR, ENABLE);

  /* Enable the GPIO_LED Clock */
  RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA | RCC_APB2Periph_GPIOB |
						 RCC_APB2Periph_GPIOC | RCC_APB2Periph_SPI1 |
						 RCC_APB2Periph_AFIO | RCC_APB2Periph_ADC1, ENABLE);


  /* Setup SysTick Timer for 10 msec interrupts  */
  if (SysTick_Config(SystemCoreClock / 100))
  {
    /* Capture error */
    while (1);
  }

  /* Enable access to the backup register => LSE can be enabled */
 // PWR_BackupAccessCmd(ENABLE);

  /* Enable LSE (Low Speed External Oscillation) */
  //RCC_LSEConfig(RCC_LSE_ON);
}
u8 GD_Page[256];
void taskGD(void *pdata)
{

	  GD_WriteEnable();
	  u8 GD_StateLow = GD_GetStatusLow();

	  GD_ReadPage(0x23800, &GD_Page[0]);

while(1){


}

	CoExitTask();	 /*!< Delete 'task_init' task. 	*/
}


int main(void)
{
	RCC_Config();
	GD_Init();

	CoInitOS();
    CoCreateTask(taskGD, (void *)0, 10,&task_init_Stk[TASK_STK_SIZE-1], TASK_STK_SIZE);
    //CoCreateTask(taskUART, (void *)0, 10,&task_init_Stk[TASK_STK_SIZE-1], TASK_STK_SIZE);
	CoStartOS();
    while(1);
}

#include "stm32f10x.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_rcc.h"
#include <CoOs.h>

#include "common.h"
#include "gd25q_driver.h"
#include "stm32f10x_usart.h"

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

void UART_Config(){

    GPIO_InitTypeDef GPIO_InitStructure;
    USART_InitTypeDef USART_InitStructure;

  /* Configure USART1 Tx (PA.09) as alternate function push-pull */
  GPIO_InitStructure.GPIO_Pin = GPIO_Pin_9;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_10MHz;
  GPIO_Init(GPIOA, &GPIO_InitStructure);

  /* Configure USART1 Rx (PA.10) as input floating */
  GPIO_InitStructure.GPIO_Pin = GPIO_Pin_10;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;
  GPIO_Init(GPIOA, &GPIO_InitStructure);
  /*Usart init attributes 2400, 8N1*/
  USART_InitStructure.USART_BaudRate = 4800 ;
  USART_InitStructure.USART_WordLength = USART_WordLength_8b;
  USART_InitStructure.USART_StopBits = USART_StopBits_1;
  USART_InitStructure.USART_Parity = USART_Parity_No;
  USART_InitStructure.USART_HardwareFlowControl = USART_HardwareFlowControl_None;
  USART_InitStructure.USART_Mode = USART_Mode_Tx | USART_Mode_Rx ;
  USART_Init(USART1, &USART_InitStructure);
  /* Enable USART1 */
  USART_Cmd(USART1, ENABLE);
}

u8 GD_Page[256];
void taskGD(void *pdata)
{
	printf("Test UART: %02x\n\r",1);

	  GD_WriteEnable();
	  u8 GD_StateLow = GD_GetStatusLow();

	  GD_ReadPage(0x23800, &GD_Page[0]);

while(1){


}

	CoExitTask();	 /*!< Delete 'task_init' task. 	*/
}
uint8 UART_TxByte(const uint8 u8_byteTx)
{
  extern bool b_tx_flag;
  USART1->DR = u8_byteTx;
  while (!b_tx_flag);
    b_tx_flag=0;

    return 1;
}
void USART1_IRQHandler(void)
{
  extern bool b_tx_flag;
  extern bool b_rx_flag;

  if ( USART1->SR & 0x0040)
    {
      b_tx_flag = 1;
    }
  else if (  USART1->SR & 0x0020)
    {
      b_rx_flag = 1;
    }
}

int main(void)
{
	RCC_Config();
	UART_Config();
	GD_Init();

	CoInitOS();
    CoCreateTask(taskGD, (void *)0, 10,&task_init_Stk[TASK_STK_SIZE-1], TASK_STK_SIZE);
    //CoCreateTask(taskUART, (void *)0, 10,&task_init_Stk[TASK_STK_SIZE-1], TASK_STK_SIZE);
	CoStartOS();
    while(1);
}

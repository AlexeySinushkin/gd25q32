#include "stm32f10x.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_rcc.h"
#include "misc.h" //NVIC
#include <CoOs.h>
#include <stdio.h>

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
						 RCC_APB2Periph_AFIO | RCC_APB2Periph_ADC1 |
						 RCC_APB2Periph_USART1, ENABLE);


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
/**
  * @brief  Configures the nested vectored interrupt controller.
  * @param  None
  * @retval None
  */
void NVIC_Configuration(void)
{
  NVIC_InitTypeDef NVIC_InitStructure;

  /* Enable the USARTx Interrupt */
  NVIC_InitStructure.NVIC_IRQChannel = USART1_IRQn;
  NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 0;
  NVIC_InitStructure.NVIC_IRQChannelSubPriority = 0;
  NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;
  NVIC_Init(&NVIC_InitStructure);
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

  /* Enable the USART1 Receive interrupt: this interrupt is generated when the
       USART1 receive data register is not empty */
  USART_ITConfig(USART1, USART_IT_RXNE, ENABLE);
}


u8 GDPage[256];
#define RX_BUF_SIZE 256
u8 rxString[RX_BUF_SIZE];
u16 rxIndex=0;
void taskGD(void *pdata)
{
	//printf("Test UART: %02x\n\r",1);

	  GD_WriteEnable();
	  u8 GD_StateLow = GD_GetStatusLow();

	  GD_ReadPage(0x23800, &GDPage[0]);


	  //USART_SendData(USART1, 0xE7);
	  //while (USART_GetFlagStatus(USART1,USART_FLAG_TC)==RESET);

	  printf(" Ready to flash\0");

	while(1){


	}

	CoExitTask();	 /*!< Delete 'task_init' task. 	*/
}

//u8 rxByte;
/**
  * @brief  This function handles USARTx global interrupt request.
  * @param  None
  * @retval None
  */
void USART1_IRQHandler(void)
{
    if (USART_GetFlagStatus(USART1,USART_FLAG_RXNE)==SET)
	{
    	u8 rxByte = USART_ReceiveData(USART1);
    	if (rxIndex<RX_BUF_SIZE){
    		rxString[rxIndex]=rxByte;
    		rxIndex++;
    	}
	}
}

int main(void)
{
	RCC_Config();
	NVIC_Configuration();
	UART_Config();
	GD_Init();

	CoInitOS();
    CoCreateTask(taskGD, (void *)0, 10,&task_init_Stk[TASK_STK_SIZE-1], TASK_STK_SIZE);
    //CoCreateTask(taskUART, (void *)0, 10,&task_init_Stk[TASK_STK_SIZE-1], TASK_STK_SIZE);
	CoStartOS();
    while(1);
}

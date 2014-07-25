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
#define RX_BUF_SIZE 300
#define TX_BUF_SIZE 16
#define PACKET_START 0xB1

typedef enum
{
	Idle = 0,
	WaitingStart,
	ReceivingPacket,
	ReceivingTimeout,
	Processing,
	SendingAnswer
} States;


typedef struct
{
  States State:7;
  u16 rxIndex:9;
  u8 txIndex:8;
  u8 rxBuf[RX_BUF_SIZE];
  u8 txBuf[TX_BUF_SIZE];
} Env_t;

//extern __IO Env_t Env;
__IO Env_t Env;

OS_TCID sftmr;
void PacketTimeOut(void)
{
 if (Env.State==ReceivingPacket){
	 Env.State=WaitingStart;
	 Env.rxIndex=0;
 }
 //StatusType result = CoStopTmr(sftmr);
}

void taskGD(void *pdata)
{
	//создаем таймер таймаута получения 2 секунды хватит
	sftmr = CoCreateTmr(TMR_TYPE_ONE_SHOT, 200,	0, PacketTimeOut);

	  GD_WriteEnable();
	  u8 GD_StateLow = GD_GetStatusLow();

	  Env.State=WaitingStart;


	while(1){
		//ждем новый пакет
		while(Env.rxIndex==0);
		int i=0;
		if (Env.rxBuf[0]==PACKET_START){
			//good
			Env.State=ReceivingPacket;
			//стартуем таймер
			StatusType result = CoStartTmr(sftmr);
		}else{
			Env.rxIndex=0;
			Env.State=WaitingStart;
			continue;
		}
		u16 packetSizeWithStart=0;
		while(Env.State==ReceivingPacket){//статус может изменить таймер таймаута
			//0xB1 0x01 0x09
			if (Env.rxIndex>3 && packetSizeWithStart==0){
				packetSizeWithStart=Env.rxBuf[1]+
						Env.rxBuf[2]*256+1;
			}
			else if(Env.rxIndex==packetSizeWithStart){
				StatusType result = CoStopTmr(sftmr);
				Env.State=Processing;
				//check CRC
				u8 crc=0;
				for (i=1;i<packetSizeWithStart-2;i++){
					crc+=Env.rxBuf[i];
				}
				if (crc==Env.rxBuf[packetSizeWithStart-2]&&
						crc^0xAA==Env.rxBuf[packetSizeWithStart-1]){

				//processPacket();
					if (Env.rxBuf[3]==0x03){//write page
						u32 address=Env.rxBuf[4]|
								Env.rxBuf[5]<<8 | Env.rxBuf[6]<<16 |
								Env.rxBuf[7]<<24;
						GD_WriteEnable();
						GD_WritePage(address, &Env.rxBuf[8]);
						GD_ReadPage(address, &GDPage[0]);
						//check
						bool badWrite=FALSE;
						for (i=0;i<256;i++){
							if (GDPage[i]!=Env.rxBuf[8+i]){
								badWrite=TRUE;
								break;
							}
						}
						Env.State=SendingAnswer;
						Env.txBuf[0]=0xB1;
						Env.txBuf[1]=0x09;
						Env.txBuf[2]=0x00;
						Env.txBuf[3]=0x04;
						Env.txBuf[4]=address;
						Env.txBuf[5]=address>>8;
						Env.txBuf[6]=address>>16;
						Env.txBuf[7]=address>>24;
						if (badWrite){
							Env.txBuf[3]=0x06;
						}
						Env.txBuf[8]=0;
						for (i=1;i<8;i++){
							Env.txBuf[8]+=Env.txBuf[i];
						}
						Env.txBuf[9]=Env.txBuf[8]^0xAA;
						Env.txIndex=0;
						Env.State=SendingAnswer;
					}
					//processPacket();
				}

			}//Env.rxIndex==packetSizeWithStart

		}//Env.State==ReceivingPacket
		if (Env.State==SendingAnswer){
			for(i=0;i<10;i++){
				USART_SendData(USART1, Env.txBuf[i]);
				while (USART_GetFlagStatus(USART1,USART_FLAG_TC)==RESET);
			}
			Env.rxIndex=0;
			Env.State=WaitingStart;
			continue;
		}

		if (Env.State==ReceivingTimeout){
			Env.rxIndex=0;
			Env.State=WaitingStart;
			continue;
		}

	}

	CoExitTask();	 /*!< Delete 'task_init' task. 	*/
}

//GD_ReadPage(0x23800, &GDPage[0]);


//USART_SendData(USART1, 0xE7);
//while (USART_GetFlagStatus(USART1,USART_FLAG_TC)==RESET);

//printf(" Ready to flash\0");


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
    	if (Env.rxIndex<RX_BUF_SIZE){
    		Env.rxBuf[Env.rxIndex]=rxByte;
    		Env.rxIndex++;
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

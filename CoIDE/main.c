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
//void task_init    	(void *pdata);	  /*!< Initialization task.               */
//#define TASK_STK_SIZE2		  64	 		      /*!< Define stack size.					      */
//OS_STK   task_init_Stk2[TASK_STK_SIZE2];	 	  /*!< Stack of 'task_init' task.		*/
#define TASK_STK_SIZE3		  64	 		      /*!< Define stack size.					      */
OS_STK   task_init_Stk3[TASK_STK_SIZE3];

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
  USART_InitStructure.USART_BaudRate = 115200;
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
  u8 txIndex:7;
  bool canListen:1;
  OS_TID gdTaskID;
  u8 rxBuf[RX_BUF_SIZE];
  u8 txBuf[TX_BUF_SIZE];
  u8 GDPage[256];
} Env_t;

//extern __IO Env_t Env;
volatile Env_t Env;

OS_TCID sftmr;
void PacketTimeOut(void)
{
 if (Env.State==ReceivingPacket){
	 Env.State=WaitingStart;
	 Env.rxIndex=0;
 }
 //StatusType result = CoStopTmr(sftmr);
}
/*
void taskSender(void *pdata){
	int i=0;
	while(1){
		Env.txBuf[0]=0xB1;
		Env.txBuf[1]=0x09;
		Env.txBuf[2]=0x00;
		Env.txBuf[3]=0x04;
		for(i=0;i<10;i++){
			USART_SendData(USART1, Env.txBuf[i]);
			while (USART_GetFlagStatus(USART1,USART_FLAG_TC)==RESET);
		}
		CoTickDelay(500);//���� 5 ���.
	}
}

*/
void taskBlink(void *pdata){

    GPIO_InitTypeDef  GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_2;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_10MHz;
    GPIO_Init(GPIOA, &GPIO_InitStructure);

	while(1){
		GPIOA->BRR=GPIO_Pin_2;
		CoTickDelay(50);//���� 0.5 ���.
		GPIOA->BSRR=GPIO_Pin_2;
		CoTickDelay(50);
	}
}


void taskGD(void *pdata){





	//������� ������ �������� ��������� 2 ������� ������
	sftmr = CoCreateTmr(TMR_TYPE_ONE_SHOT, 200,	0, PacketTimeOut);
	int i=0;


	//GD_WriteEnable();
	//GD_EraseSector(0);
	//CoTickDelay(2);
/*
	for (i=0;i<256;i++){
		Env.rxBuf[8+i]=i;
	}
	GD_WriteEnable();
	GD_WritePage(0, &(Env.rxBuf[8]));
	CoTickDelay(1);
	GD_ReadPage(0, &Env.GDPage[0]);
	//check
	bool badWrite1=FALSE;
	for (i=0;i<256;i++){
		if (Env.GDPage[i]!=Env.rxBuf[8+i]){
			badWrite1=TRUE;
		}
	}
*/


	  //GD_WriteEnable();
	  u8 GD_StateLow = GD_GetStatusLow();

	  Env.State=WaitingStart;


	while(1){
		Env.canListen=TRUE;
		//���� ����� ����� while(Env.rxIndex==0);
		CoSuspendTask(Env.gdTaskID);

		if (Env.rxBuf[0]==PACKET_START){
			//good
			Env.State=ReceivingPacket;
			//�������� ������
			StatusType result = CoStartTmr(sftmr);
		}else{
			Env.rxIndex=0;
			Env.State=WaitingStart;
			continue;
		}
		u16 packetSizeWithStart=0;
		while(Env.State==ReceivingPacket){//������ ����� �������� ������ ��������
			//0xB1 0x01 0x09
			if (Env.rxIndex>3 && packetSizeWithStart==0){
				packetSizeWithStart=Env.rxBuf[1]+
						(Env.rxBuf[2]*256)+1;
				if (packetSizeWithStart>RX_BUF_SIZE-6){
					Env.rxIndex=0;
					Env.State=WaitingStart;
					continue;
				}
			}
			else if(Env.rxIndex==packetSizeWithStart
					&& Env.rxIndex>3){
				//����� ������. ������������� ������ � ��������� ���
				StatusType result = CoStopTmr(sftmr);
				Env.canListen=FALSE;
				Env.State=Processing;
				//check CRC
				u8 crc=0;
				//265-2=263
				for (i=0;i<packetSizeWithStart-2;i++){
					crc+=Env.rxBuf[i];
				}
				if (crc==Env.rxBuf[packetSizeWithStart-2]&&
						crc^0xAA==Env.rxBuf[packetSizeWithStart-1]){

				//processPacket();
					if (Env.rxBuf[3]==0x03){//write page
						u32 address=Env.rxBuf[4]|
								Env.rxBuf[5]<<8 | Env.rxBuf[6]<<16 |
								Env.rxBuf[7]<<24;

						//������� ������
						/*
						if (address%4096==0){
							GD_WriteEnable();
							GD_EraseSector(address);
							while(GD_GetStatusLow()&1 == 1)
							{
								CoTickDelay(2);
							}
						}*/

						GD_WriteEnable();
						//CoSchedLock();
						GD_WritePage(address, &(Env.rxBuf[8]));
						u8 cnt=200;
						while(GD_GetStatusLow()&1 == 1//wait WIP flag
								&& --cnt>0)
						{
							CoTickDelay(1);
						}
						GD_ReadPage(address, &Env.GDPage[0]);
						//CoSchedUnlock();
						//check
						bool badWrite=FALSE;
						for (i=0;i<256;i++){
							if (Env.GDPage[i]!=Env.rxBuf[8+i]){
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
						for (i=0;i<8;i++){
							Env.txBuf[8]+=Env.txBuf[i];
						}
						Env.txBuf[9]=Env.txBuf[8]^0xAA;
						Env.txIndex=0;
						Env.State=SendingAnswer;
					}
					//processPacket();
				}else{//crc error
					Env.rxIndex=0;
					Env.State=WaitingStart;
					continue;
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
    	if (Env.canListen==TRUE && Env.rxIndex<RX_BUF_SIZE){
    		Env.rxBuf[Env.rxIndex]=rxByte;
    		Env.rxIndex++;
    	}
    	CoAwakeTask(Env.gdTaskID);
	}
}

int main(void)
{
	RCC_Config();
	NVIC_Configuration();
	UART_Config();
	GD_Init();

	CoInitOS();
	Env.gdTaskID=CoCreateTask(taskGD, (void *)0, 10,
			&task_init_Stk[TASK_STK_SIZE-1], TASK_STK_SIZE);
    /*OS_TID tid =  CoCreateTask(taskSender, (void *)0, 10,
    		&task_init_Stk2[TASK_STK_SIZE2-1], TASK_STK_SIZE2);*/
    CoCreateTask(taskBlink, (void *)0, 10,
    		&task_init_Stk3[TASK_STK_SIZE3-1], TASK_STK_SIZE3);
	CoStartOS();
    while(1);
}

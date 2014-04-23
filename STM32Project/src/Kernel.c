
#include "stm32f10x.h"
#include "FreeRTOS.h"
#include "task.h"

#include "stm32f10x_spi.h"
#include "Kernel.h"


__IO u8 RF_Buffer_FIFO[64];
__IO u8 RF_Buffer_Cmd[3];



#define RF_GPIO_FIFO            GPIO_Pin_1  
#define RF_GPIO_PKT             GPIO_Pin_2
#define RF_GPIO_RESET           GPIO_Pin_3


#define SPI_NSS              GPIO_Pin_4
#define SPI_SCK             GPIO_Pin_5
#define SPI_MISO             GPIO_Pin_6
#define SPI_MOSI             GPIO_Pin_7   
#define SPI_HOLD             GPIO_Pin_12
#define SPI_WP             GPIO_Pin_11
#define SPI_GPIO            GPIOA




void Init(void)
{
  //NVIC_InitTypeDef NVIC_InitStructure;
  //EXTI_InitTypeDef EXTI_InitStructure; 
  
   /*
    // Connect FIFO EXTI Line to Button GPIO Pin /
    GPIO_EXTILineConfig(GPIO_PortSourceGPIOA, GPIO_PinSource1);
    // Configure Button EXTI line /
    EXTI_InitStructure.EXTI_Line = EXTI_Line1;
    EXTI_InitStructure.EXTI_Mode = EXTI_Mode_Interrupt;
    EXTI_InitStructure.EXTI_Trigger = EXTI_Trigger_Rising;  
    EXTI_InitStructure.EXTI_LineCmd = ENABLE;
    EXTI_Init(&EXTI_InitStructure);
  
	// Enable and set Button EXTI Interrupt to the lowest priority 
    NVIC_InitStructure.NVIC_IRQChannel = EXTI1_IRQn;
    NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 0x0F;
    NVIC_InitStructure.NVIC_IRQChannelSubPriority = 0x0F;
    NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;
    NVIC_Init(&NVIC_InitStructure); 
	
    // Connect PKT EXTI Line to Button GPIO Pin /
    GPIO_EXTILineConfig(GPIO_PortSourceGPIOA, GPIO_PinSource2);
    // Configure Button EXTI line /
    EXTI_InitStructure.EXTI_Line = EXTI_Line2;
    EXTI_InitStructure.EXTI_Mode = EXTI_Mode_Interrupt;
    EXTI_InitStructure.EXTI_Trigger = EXTI_Trigger_Rising;  
    EXTI_InitStructure.EXTI_LineCmd = ENABLE;
    EXTI_Init(&EXTI_InitStructure);
  
	// Enable and set EXTI Interrupt to the lowest priority 
    NVIC_InitStructure.NVIC_IRQChannel = EXTI2_IRQn;
    NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 0x0F;
    NVIC_InitStructure.NVIC_IRQChannelSubPriority = 0x0F;
    NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;
    NVIC_Init(&NVIC_InitStructure); 
	*/
	
  SPI_InitTypeDef SPI_InitStructure;
	//SPI_MASTER configuration ------------------------------------------------
	SPI_InitStructure.SPI_Direction = SPI_Direction_2Lines_FullDuplex;
	SPI_InitStructure.SPI_Mode = SPI_Mode_Master;
	SPI_InitStructure.SPI_DataSize = SPI_DataSize_8b;
	SPI_InitStructure.SPI_CPOL = SPI_CPOL_High;
	SPI_InitStructure.SPI_CPHA = SPI_CPHA_2Edge;
	SPI_InitStructure.SPI_NSS = SPI_NSS_Hard;
	SPI_InitStructure.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_8;
	SPI_InitStructure.SPI_FirstBit = SPI_FirstBit_MSB;
	SPI_InitStructure.SPI_CRCPolynomial = 7;
	SPI_Init(SPI1, &SPI_InitStructure);
	
	GPIO_InitTypeDef  GPIO_SpiStructure;
	//Configure SPI_MASTER pins: SCK, MISO and MOSI
	GPIO_SpiStructure.GPIO_Pin = SPI_SCK | SPI_MISO | 
		SPI_MOSI | SPI_NSS;
	GPIO_SpiStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_SpiStructure.GPIO_Mode = GPIO_Mode_AF_PP;
	GPIO_Init(SPI_GPIO, &GPIO_SpiStructure);
	
	GPIO_InitTypeDef  GPIO_SpiStructure2;
	GPIO_SpiStructure2.GPIO_Pin = SPI_HOLD | SPI_WP;  
	GPIO_SpiStructure2.GPIO_Speed = GPIO_Speed_50MHz;  
	GPIO_SpiStructure2.GPIO_Mode =  GPIO_Mode_Out_PP;
	GPIO_Init(SPI_GPIO, &GPIO_SpiStructure2);
	
	SPI_GPIO->BSRR=SPI_HOLD;
	SPI_GPIO->BSRR=SPI_WP;  


	// Enable SPI_MASTER 
	SPI_Cmd(SPI1, ENABLE);    
}



//0 конфигурируется
//1 закончено
u8 ConfigFramRegi(const u8* configTable, u8 configSize)
{
	/*if (State_RF.RF_TransferState==RF_NoTransfering)
	{
		u8 index=State_RF.RF_Tmp*3;  //индекс регистра по порядку  
		RF_Buffer_Cmd[0]=configTable[index];
		RF_Buffer_Cmd[1]=configTable[index+1];	
		RF_Buffer_Cmd[2]=configTable[index+2];
		State_RF.RF_BufPtr=&RF_Buffer_Cmd[0];
		State_RF.RF_BufCount=3;
		State_RF.RF_BufIndex=0;
		State_RF.RF_TransferDirection=RF_TD_Write;
		SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_TXE, ENABLE);
		return 0;
	}
	
	//происходит прерывание на передачу
	
	if (State_RF.RF_TransferState==RF_TransferComplete)
	{
	  State_RF.RF_Tmp++;
	  State_RF.RF_TransferState=RF_NoTransfering;
		//сконфигурировали, переходим к проверке
		if (((configSize/3)==State_RF.RF_Tmp)){		
			State_RF.RF_Tmp=0;	
			return 1;
		}		  
	}
  */
	return 0;
}



void vTaskKernel(void *pvParameters) {
  vTaskDelay(100);
 

  for(;;){
    

    vTaskDelay(100);
  }
}

u8 GD_READ_Status_Low()
{
  u8 tmp=0;
  SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_TXE, ENABLE);
  SPI_I2S_SendData(SPI1, 0x05);
  while (SPI_I2S_GetITStatus(SPI1, SPI_I2S_IT_TXE) == RESET){
    vTaskDelay(1);
  }
  SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_TXE, DISABLE);	
  return tmp
}

/*
while(SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_RXNE)==RESET);
		u8 data=SPI_I2S_ReceiveData(SPI1);


*/

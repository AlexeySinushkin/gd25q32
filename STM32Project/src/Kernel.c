
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


#define SPI_Nss              GPIO_Pin_4
#define SPI_SCK             GPIO_Pin_5
#define SPI_MISO             GPIO_Pin_6
#define SPI_MOSI             GPIO_Pin_7   
#define SPI_NHold             GPIO_Pin_12
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
		SPI_MOSI | SPI_Nss;
	GPIO_SpiStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_SpiStructure.GPIO_Mode = GPIO_Mode_AF_PP;
	GPIO_Init(SPI_GPIO, &GPIO_SpiStructure);
	
	GPIO_InitTypeDef  GPIO_SpiStructure2;
	GPIO_SpiStructure2.GPIO_Pin = SPI_NHold | SPI_WP;  
	GPIO_SpiStructure2.GPIO_Speed = GPIO_Speed_50MHz;  
	GPIO_SpiStructure2.GPIO_Mode =  GPIO_Mode_Out_PP;
	GPIO_Init(SPI_GPIO, &GPIO_SpiStructure2);
	
	SPI_GPIO->BSRR=SPI_NHold;
	SPI_GPIO->BSRR=SPI_WP;  


	// Enable SPI_MASTER 
	SPI_Cmd(SPI1, ENABLE);    
}



u8 send1_receive1(u8 data)
{
  SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_TXE, ENABLE);
  //шлем команду
  SPI_I2S_SendData(SPI1, data);
  while (SPI_I2S_GetITStatus(SPI1, SPI_I2S_IT_TXE) == RESET){
    vTaskDelay(1);
  }
  
  
  SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_RXNE, ENABLE);    
  //SPI_I2S_ClearFlag(SPI1, SPI_I2S_FLAG_RXNE);
  //send dummy
  SPI_I2S_SendData(SPI1, 0xFF);
  //Receive buffer not empty interrupt.
  while (SPI_I2S_GetITStatus(SPI1, SPI_I2S_IT_RXNE) == RESET){
    vTaskDelay(1);
  }
  u8 tmp = SPI_I2S_ReceiveData(SPI1);
  
  SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_TXE, DISABLE); 
  SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_RXNE, DISABLE);   
  
  return tmp;

}

u16 GD_READ_Status()
{
  u16 tmp=0;
  tmp=send1_receive1(0x05);//low part
  return tmp;
}



void vTaskKernel(void *pvParameters) {
  vTaskDelay(100);
 

  for(;;){
    u16 tmp = GD_READ_Status();
    if(tmp==5){
      vTaskDelay(1);
    }
    vTaskDelay(100);
  }
}

/*
while(SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_RXNE)==RESET);
		u8 data=SPI_I2S_ReceiveData(SPI1);


*/

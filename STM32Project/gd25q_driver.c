

// подключаем библиотеку CMSIS
#include "gd25q_driver.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_rcc.h"
#include "stm32f10x_spi.h"


void GD_Init(void){

  RCC_APB1PeriphClockCmd(RCC_APB1Periph_PWR, ENABLE);
    RCC_APB2PeriphClockCmd (RCC_APB2Periph_AFIO  | 
                            RCC_APB2Periph_GPIOA | RCC_APB2Periph_SPI1, ENABLE);

    GPIO_InitTypeDef GPIO_InitStructure;
    SPI_InitTypeDef SPI_InitStructure;


		/* Configure SPI1 pins: SCK(PA5) and MOSI (PA7)----*/
        GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_5  | GPIO_Pin_7;
        GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
        GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_AF_PP;
        GPIO_Init(GPIOA, &GPIO_InitStructure);
        
		/*MISO Stupid logic (Input pull up)*/
		GPIO_InitStructure.GPIO_Pin =GPIO_Pin_6;
		GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;
		GPIO_Init(GPIOA, &GPIO_InitStructure);

        
        /* Configure PA4 as CS (Chip select)  -------------------------------*/
        GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_4;//
        GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
        GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_Out_PP;
        GPIO_Init(GPIOA, &GPIO_InitStructure);              
        GPIOA->BSRR=GPIO_Pin_4;          


              
        /* SPI1 Configuration ----------------------------------------------------*/

          SPI_InitStructure.SPI_Direction = SPI_Direction_2Lines_FullDuplex;
          SPI_InitStructure.SPI_Mode = SPI_Mode_Master;
          SPI_InitStructure.SPI_DataSize = SPI_DataSize_8b;
          //If CPOL is reset, the SCK pin has a low-level idle state.
          SPI_InitStructure.SPI_CPOL = SPI_CPOL_High;
          SPI_InitStructure.SPI_CPHA = SPI_CPHA_2Edge;
          SPI_InitStructure.SPI_NSS = SPI_NSS_Soft;
          SPI_InitStructure.SPI_FirstBit = SPI_FirstBit_MSB;
          SPI_InitStructure.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_8;
          SPI_InitStructure.SPI_CRCPolynomial = 8;
          SPI_Init(SPI1, &SPI_InitStructure);   
          
          /* Enable SPI1 */
          SPI_Cmd(SPI1, ENABLE);

//GPIOA->BSRR=GPIO_Pin_11;//WP
//GPIOA->BSRR=GPIO_Pin_12;//HOLD

}
//Chip select
void cs(){
	GPIOA->BRR=GPIO_Pin_4;
}
//Chip deselect
void cd(){
	GPIOA->BSRR=GPIO_Pin_4; 
}
//receive dummy
void receive_dummy(){
     while(SPI_I2S_GetFlagStatus(SPI1,SPI_I2S_FLAG_RXNE)== RESET);
     SPI_I2S_ReceiveData(SPI1); 
}
//send dummy
void send_dummy(){
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,0xFF);
}
void GD_WritePage(u32 address, u8* data)
{
	cs();
   
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,0x03);
     
	 //receive dummy
		receive_dummy();
     
		//send 3th param byte
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,(u8)(address>>16));

	 //receive dummy
		receive_dummy();

		//send 2nd param byte
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,(u8)(address>>8));

	 //receive dummy
		receive_dummy();

		//send 1th param byte
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,(u8)address);

	 //receive dummy
		receive_dummy();

		u16 i=0;
		for (i=0; i<256; i++){
			while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
			SPI_I2S_SendData(SPI1,*(data+i));
			 
			//receive dummy
			receive_dummy();
		}

     cd(); 
}

void GD_Read(u32 address, u8* result, u16 result_count){
	cs();
   
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,0x03);
     
	 //receive dummy
		receive_dummy();
     
		//send 3th param byte
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,(u8)(address>>16));

	 //receive dummy
		receive_dummy();

		//send 2nd param byte
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,(u8)(address>>8));

	 //receive dummy
		receive_dummy();

		//send 1th param byte
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,(u8)address);

	 //receive dummy
		receive_dummy();

		u8 i=0;
		for (i=0; i<result_count; i++){
			send_dummy();
			 
			//receive data
			 while(SPI_I2S_GetFlagStatus(SPI1,SPI_I2S_FLAG_RXNE)== RESET);
			 u8 r8 = SPI_I2S_ReceiveData(SPI1);
			 *(result+i)=r8;
		}

     cd(); 
}
void GD_ReadPage(u32 address, u8* result){
	GD_Read(address, result, 256);
}

u8 GD_SendCommand1Anwer1(u8 command){
	u8 result=0; 
	cs();
   
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,command);
     
	 //receive dummy
     receive_dummy();     
     
     //send dummy
     send_dummy();

     //receive data
     while(SPI_I2S_GetFlagStatus(SPI1,SPI_I2S_FLAG_RXNE)== RESET);
     result = SPI_I2S_ReceiveData(SPI1);

     cd();
	 return result;
}

void GD_SendCommand1(u8 command){
     cs();
	 //send command
     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,command);
     //receive dummy
     receive_dummy();    
     cd();  
}

void GD_WriteEnable()
{
	GD_SendCommand1(0x06);
}

u8 GD_GetStatusLow()
{
	return GD_SendCommand1Anwer1(0x05);
}
u8 GD_GetStatusHigh()
{
	return GD_SendCommand1Anwer1(0x35);
}


// подключаем библиотеку CMSIS
#include "stm32f10x.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_rcc.h"
#include "misc.h"
#include "stm32f10x_spi.h"
#include "stm32f10x_usart.h"


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





uint8_t recData;
uint8_t sendData=0x00;
int i;
void SPI_test(void){

    RCC_APB2PeriphClockCmd (RCC_APB2Periph_USART1 | RCC_APB2Periph_AFIO  | RCC_APB2Periph_GPIOA | RCC_APB2Periph_SPI1, ENABLE);
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_SPI2,ENABLE);

    GPIO_InitTypeDef GPIO_InitStructure;
    USART_InitTypeDef USART_InitStructure;
    SPI_InitTypeDef SPI_InitStructure;

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

      /* Configure SPI1 pins: SCK(PA5), MISO (Not needed because rec  only  PA6) and MOSI (PA7)  -------------------------------*/
        GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_5 | GPIO_Pin_7;
        GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
        GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_AF_PP;
        GPIO_Init(GPIOA, &GPIO_InitStructure);

        /* Configure PA4 as CS (Chip select) and PA6 as A0 (data /disp select) -------------------------------*/
              GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_4 | GPIO_Pin_6;
              GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
              GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_Out_PP;
              GPIO_Init(GPIOA, &GPIO_InitStructure);

        /* SPI1 Configuration ----------------------------------------------------*/
        /*
         * Mode:Master
         * Direction: send only
         * Datasize: 8b (0x00 -> 0xFF)
         * SPOL = idle high
         * CPHA = read data with rising edge (1 edge ->down, 2 edge-> up)
         * Baudrade= just low as possible for testing purposes, 12MHz/256= 46,875kHz
         */
          SPI_InitStructure.SPI_Direction = SPI_Direction_2Lines_FullDuplex;
          SPI_InitStructure.SPI_Mode = SPI_Mode_Master;
          SPI_InitStructure.SPI_DataSize = SPI_DataSize_8b;
          SPI_InitStructure.SPI_CPOL = SPI_CPOL_High;
          SPI_InitStructure.SPI_CPHA = SPI_CPHA_2Edge;
          SPI_InitStructure.SPI_NSS = SPI_NSS_Soft;
          SPI_InitStructure.SPI_FirstBit = SPI_FirstBit_MSB;
          SPI_InitStructure.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_64;
          SPI_InitStructure.SPI_CRCPolynomial = 8;
          SPI_Init(SPI1, &SPI_InitStructure);
          /* Enable SPI1 */
          SPI_Cmd(SPI1, ENABLE);
          //Settings for slave
          SPI_InitStructure.SPI_Direction = SPI_Direction_2Lines_FullDuplex;
          SPI_InitStructure.SPI_Mode = SPI_Mode_Slave;
          SPI_Init(SPI2, &SPI_InitStructure);
          SPI_Cmd(SPI2,ENABLE);
      //printf(("Started!\n\r"));

 while(1){
     if(sendData%8<4){
         GPIO_WriteBit(GPIOA,GPIO_Pin_4,Bit_SET);
     }else{
         GPIO_WriteBit(GPIOA,GPIO_Pin_4,Bit_RESET);
     }
     if(sendData%16<8){
         GPIO_WriteBit(GPIOA,GPIO_Pin_6,Bit_SET);
     }else{
         GPIO_WriteBit(GPIOA,GPIO_Pin_6,Bit_RESET);
     }

     while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);
     SPI_I2S_SendData(SPI1,sendData);
     //printf("send data: %02x\n\r",sendData);
     while(SPI_I2S_GetFlagStatus(SPI2,SPI_I2S_FLAG_RXNE)== RESET);
     recData= SPI_I2S_ReceiveData(SPI2);
     //printf("rec data: %02x\n\r",recData);
     for(i=0;i<1000000;i++);
     sendData++;
 }
}

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
  SPI_test();
  
  
  while (1){
    u8 i=0;
    i++;
    if (i==10)break;
  }
  return 0;
}


 
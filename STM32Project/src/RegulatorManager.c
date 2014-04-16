//�������� ��������
#include "stm32f10x.h"
#include "FreeRTOS.h"
#include "task.h"

#include "ShutterManager.h"
#include "stm32f10x_tim.h"
#include "common.h"

// ������������ ������ �������
TIM_OCInitTypeDef TIM_OCConfig;
// ������������ �����
GPIO_InitTypeDef GPIO_Config;

bool makeChange=FALSE;

void SetShutter(u16 deg){
    TIM_OCConfig.TIM_Pulse = deg;  
    // �������������� TIM2_CH2 ����� ������� �2
    TIM_OC2Init(TIM2, &TIM_OCConfig);
    makeChange=TRUE;    
}
void vTaskShutterManager(void *pvParameters) {

    // ���1
    GPIO_Config.GPIO_Pin = GPIO_Pin_1;
    // �������������� ������� (� ����� ������ - ����� �������), Push-Pull
    GPIO_Config.GPIO_Mode = GPIO_Mode_AF_PP;
    // ������� - 50 MHz
    GPIO_Config.GPIO_Speed = GPIO_Speed_50MHz;
    // �������������� ���� A ���� �������������
    GPIO_Init(GPIOA, &GPIO_Config);

    // ���2
    GPIO_Config.GPIO_Pin = GPIO_Pin_2;
    // ���� 0 ���� HiZ
    GPIO_Config.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_Init(GPIOA, &GPIO_Config);
    GPIOA->BRR=GPIO_Pin_2;
    
    // ������������ �������
    TIM_TimeBaseInitTypeDef TIM_BaseConfig;

    //��� 50 ��������� � ������� ������� ���������� ���������� 20��
    //������ ��� ������������� �� 1�� �� 2�� ���������� 1��
    //���� ������������ ���� �������� �� 180 (200) ��������
    //������������� ����������� ������� ������� 1��/200 - 5���
    //��������� ������� 200������*20������� ������������*50��������� � ������� = 200��� 
    // ��������� ������ �� �������� ������� � 200 kHz
    TIM_BaseConfig.TIM_Prescaler = (uint16_t) (SystemCoreClock / 200000) - 1;
    // TOP - 200*20
    TIM_BaseConfig.TIM_Period = 20*200;
    TIM_BaseConfig.TIM_ClockDivision = 0;
    // ������ �� ���� �� TIM_Period
    TIM_BaseConfig.TIM_CounterMode = TIM_CounterMode_Up;

    // �������������� ������ �2 (��� ������ ��� ��� �� ����� A)
    TIM_TimeBaseInit(TIM2, &TIM_BaseConfig);

    // ������������� ����� �������, ����� - PWM1
    TIM_OCConfig.TIM_OCMode = TIM_OCMode_PWM1;
    // ���������� - ����� �������
    TIM_OCConfig.TIM_OutputState = TIM_OutputState_Enable;
    // ����� ������� 90
    TIM_OCConfig.TIM_Pulse = Shut_Min;
    // ���������� => ����� - ��� ������� (+3.3V)
    TIM_OCConfig.TIM_OCPolarity = TIM_OCPolarity_High;

    // �������������� TIM2_CH2 ����� ������� �2
    TIM_OC2Init(TIM2, &TIM_OCConfig);

    
    // ��� � ����� - �������������� ����������� �������, ���� ������ - ��������.
    TIM_OC2PreloadConfig(TIM2, TIM_OCPreload_Enable);
    TIM_ARRPreloadConfig(TIM2, ENABLE);


  
   for(;;){
    vTaskDelay(100);    
    if (makeChange==TRUE){
      // �������� ������
      TIM_Cmd(TIM2, ENABLE);
      GPIOA->BSRR=GPIO_Pin_2;
      vTaskDelay(1000);
      GPIOA->BRR=GPIO_Pin_2;
      // ��������� ������
      TIM_Cmd(TIM2, DISABLE);
      makeChange=FALSE;
    }
  }
}

    /*if (plus==TRUE)
    {
      i+=10;
      if (i==Shut_Max)plus=FALSE;
    }
    if (plus==FALSE)
    {
      i-=10;
      if (i==Shut_Min)plus=TRUE;
    }*/
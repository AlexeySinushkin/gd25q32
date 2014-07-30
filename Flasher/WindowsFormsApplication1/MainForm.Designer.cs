namespace WindowsFormsApplication1
{
    partial class HDTool2
    {
        /// <summary>
        /// Требуется переменная конструктора.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Освободить все используемые ресурсы.
        /// </summary>
        /// <param name="disposing">истинно, если управляемый ресурс должен быть удален; иначе ложно.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Код, автоматически созданный конструктором форм Windows

        /// <summary>
        /// Обязательный метод для поддержки конструктора - не изменяйте
        /// содержимое данного метода при помощи редактора кода.
        /// </summary>
        private void InitializeComponent()
        {
            this.FileWay = new System.Windows.Forms.TextBox();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.label7 = new System.Windows.Forms.Label();
            this.buttonEditADR = new System.Windows.Forms.Button();
            this.buttonEditB = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.textBoxADRResult = new System.Windows.Forms.TextBox();
            this.buttonADR = new System.Windows.Forms.Button();
            this.textBoxBResult = new System.Windows.Forms.TextBox();
            this.buttonB = new System.Windows.Forms.Button();
            this.label9 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.textBoxInst2 = new System.Windows.Forms.TextBox();
            this.textBoxInst1 = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textBoxAddress = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.textBoxAddress2 = new System.Windows.Forms.TextBox();
            this.textBoxComPort = new System.Windows.Forms.TextBox();
            this.buttonConnection = new System.Windows.Forms.Button();
            this.buttonSendN = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.labelSize = new System.Windows.Forms.Label();
            this.buttonFmL = new System.Windows.Forms.Button();
            this.progressBar = new System.Windows.Forms.ProgressBar();
            this.richTextBoxLog = new System.Windows.Forms.RichTextBox();
            this.buttonClear = new System.Windows.Forms.Button();
            this.label6 = new System.Windows.Forms.Label();
            this.textBoxOffset = new System.Windows.Forms.TextBox();
            this.buttonHelp = new System.Windows.Forms.Button();
            this.buttonFL = new System.Windows.Forms.Button();
            this.buttonBigLit = new System.Windows.Forms.Button();
            this.buttonFindCRCStart = new System.Windows.Forms.Button();
            this.textBoxCRC = new System.Windows.Forms.TextBox();
            this.label10 = new System.Windows.Forms.Label();
            this.label11 = new System.Windows.Forms.Label();
            this.textBoxCRCStart = new System.Windows.Forms.TextBox();
            this.buttonCorrectCRC = new System.Windows.Forms.Button();
            this.checkBoxCRC = new System.Windows.Forms.CheckBox();
            this.buttonFlash = new System.Windows.Forms.Button();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // FileWay
            // 
            this.FileWay.Location = new System.Drawing.Point(12, 12);
            this.FileWay.Name = "FileWay";
            this.FileWay.Size = new System.Drawing.Size(546, 20);
            this.FileWay.TabIndex = 13;
            this.FileWay.Text = "D:\\Projects\\SCX3400_V3.00.01.19\\130409N9077tst.hd";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.label7);
            this.groupBox2.Controls.Add(this.buttonEditADR);
            this.groupBox2.Controls.Add(this.buttonEditB);
            this.groupBox2.Controls.Add(this.label2);
            this.groupBox2.Controls.Add(this.label1);
            this.groupBox2.Controls.Add(this.textBoxADRResult);
            this.groupBox2.Controls.Add(this.buttonADR);
            this.groupBox2.Controls.Add(this.textBoxBResult);
            this.groupBox2.Controls.Add(this.buttonB);
            this.groupBox2.Controls.Add(this.label9);
            this.groupBox2.Controls.Add(this.label8);
            this.groupBox2.Controls.Add(this.textBoxInst2);
            this.groupBox2.Controls.Add(this.textBoxInst1);
            this.groupBox2.Location = new System.Drawing.Point(373, 38);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(406, 120);
            this.groupBox2.TabIndex = 24;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Инструкции";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(29, 97);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(130, 13);
            this.label7.TabIndex = 44;
            this.label7.Text = "LDR R0, [PC, 12bit offset]";
            // 
            // buttonEditADR
            // 
            this.buttonEditADR.Location = new System.Drawing.Point(272, 68);
            this.buttonEditADR.Name = "buttonEditADR";
            this.buttonEditADR.Size = new System.Drawing.Size(128, 23);
            this.buttonEditADR.TabIndex = 28;
            this.buttonEditADR.Text = "Поправить смещение";
            this.buttonEditADR.UseVisualStyleBackColor = true;
            this.buttonEditADR.Click += new System.EventHandler(this.buttonEditADR_Click);
            // 
            // buttonEditB
            // 
            this.buttonEditB.Location = new System.Drawing.Point(272, 42);
            this.buttonEditB.Name = "buttonEditB";
            this.buttonEditB.Size = new System.Drawing.Size(128, 23);
            this.buttonEditB.TabIndex = 27;
            this.buttonEditB.Text = "Поправить смещение";
            this.buttonEditB.UseVisualStyleBackColor = true;
            this.buttonEditB.Click += new System.EventHandler(this.buttonEditB_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(29, 73);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(57, 13);
            this.label2.TabIndex = 25;
            this.label2.Text = "ADR/LDR";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(54, 47);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(32, 13);
            this.label1.TabIndex = 34;
            this.label1.Text = "B/BL";
            // 
            // textBoxADRResult
            // 
            this.textBoxADRResult.Location = new System.Drawing.Point(92, 70);
            this.textBoxADRResult.Name = "textBoxADRResult";
            this.textBoxADRResult.Size = new System.Drawing.Size(93, 20);
            this.textBoxADRResult.TabIndex = 33;
            this.textBoxADRResult.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // buttonADR
            // 
            this.buttonADR.Location = new System.Drawing.Point(191, 68);
            this.buttonADR.Name = "buttonADR";
            this.buttonADR.Size = new System.Drawing.Size(75, 23);
            this.buttonADR.TabIndex = 30;
            this.buttonADR.Text = "Посчитать";
            this.buttonADR.UseVisualStyleBackColor = true;
            this.buttonADR.Click += new System.EventHandler(this.buttonADR_Click);
            // 
            // textBoxBResult
            // 
            this.textBoxBResult.Location = new System.Drawing.Point(92, 44);
            this.textBoxBResult.Name = "textBoxBResult";
            this.textBoxBResult.Size = new System.Drawing.Size(93, 20);
            this.textBoxBResult.TabIndex = 29;
            this.textBoxBResult.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // buttonB
            // 
            this.buttonB.Location = new System.Drawing.Point(191, 42);
            this.buttonB.Name = "buttonB";
            this.buttonB.Size = new System.Drawing.Size(75, 23);
            this.buttonB.TabIndex = 26;
            this.buttonB.Text = "Посчитать";
            this.buttonB.UseVisualStyleBackColor = true;
            this.buttonB.Click += new System.EventHandler(this.buttonB_Click);
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(206, 16);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(100, 13);
            this.label9.TabIndex = 25;
            this.label9.Text = "Адрес назначения";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(6, 16);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(99, 13);
            this.label8.TabIndex = 21;
            this.label8.Text = "Адрес инструкции";
            // 
            // textBoxInst2
            // 
            this.textBoxInst2.Location = new System.Drawing.Point(326, 13);
            this.textBoxInst2.Name = "textBoxInst2";
            this.textBoxInst2.Size = new System.Drawing.Size(74, 20);
            this.textBoxInst2.TabIndex = 24;
            this.textBoxInst2.Text = "10D60";
            this.textBoxInst2.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // textBoxInst1
            // 
            this.textBoxInst1.Location = new System.Drawing.Point(111, 13);
            this.textBoxInst1.Name = "textBoxInst1";
            this.textBoxInst1.Size = new System.Drawing.Size(74, 20);
            this.textBoxInst1.TabIndex = 20;
            this.textBoxInst1.Text = "23828";
            this.textBoxInst1.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 50);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(55, 13);
            this.label3.TabIndex = 26;
            this.label3.Text = "[Адрес от";
            // 
            // textBoxAddress
            // 
            this.textBoxAddress.Location = new System.Drawing.Point(73, 48);
            this.textBoxAddress.Name = "textBoxAddress";
            this.textBoxAddress.Size = new System.Drawing.Size(56, 20);
            this.textBoxAddress.TabIndex = 25;
            this.textBoxAddress.Text = "237C0";
            this.textBoxAddress.TextChanged += new System.EventHandler(this.textBoxAddress_TextChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(135, 51);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(56, 13);
            this.label4.TabIndex = 28;
            this.label4.Text = "Адрес до)";
            // 
            // textBoxAddress2
            // 
            this.textBoxAddress2.Location = new System.Drawing.Point(197, 48);
            this.textBoxAddress2.Name = "textBoxAddress2";
            this.textBoxAddress2.Size = new System.Drawing.Size(56, 20);
            this.textBoxAddress2.TabIndex = 27;
            this.textBoxAddress2.Text = "23BBB";
            this.textBoxAddress2.TextChanged += new System.EventHandler(this.textBoxAddress2_TextChanged);
            // 
            // textBoxComPort
            // 
            this.textBoxComPort.Location = new System.Drawing.Point(564, 12);
            this.textBoxComPort.Name = "textBoxComPort";
            this.textBoxComPort.Size = new System.Drawing.Size(42, 20);
            this.textBoxComPort.TabIndex = 29;
            this.textBoxComPort.Text = "Com1";
            // 
            // buttonConnection
            // 
            this.buttonConnection.Location = new System.Drawing.Point(612, 10);
            this.buttonConnection.Name = "buttonConnection";
            this.buttonConnection.Size = new System.Drawing.Size(75, 23);
            this.buttonConnection.TabIndex = 30;
            this.buttonConnection.Text = "Открыть";
            this.buttonConnection.UseVisualStyleBackColor = true;
            this.buttonConnection.Click += new System.EventHandler(this.buttonCon_Click);
            // 
            // buttonSendN
            // 
            this.buttonSendN.Location = new System.Drawing.Point(699, 10);
            this.buttonSendN.Name = "buttonSendN";
            this.buttonSendN.Size = new System.Drawing.Size(75, 23);
            this.buttonSendN.TabIndex = 31;
            this.buttonSendN.Text = "Слать N";
            this.buttonSendN.UseVisualStyleBackColor = true;
            this.buttonSendN.Click += new System.EventHandler(this.buttonSendN_Click);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(259, 50);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(46, 13);
            this.label5.TabIndex = 33;
            this.label5.Text = "Размер";
            // 
            // labelSize
            // 
            this.labelSize.AutoSize = true;
            this.labelSize.Location = new System.Drawing.Point(311, 50);
            this.labelSize.Name = "labelSize";
            this.labelSize.Size = new System.Drawing.Size(0, 13);
            this.labelSize.TabIndex = 34;
            // 
            // buttonFmL
            // 
            this.buttonFmL.Location = new System.Drawing.Point(282, 79);
            this.buttonFmL.Name = "buttonFmL";
            this.buttonFmL.Size = new System.Drawing.Size(73, 19);
            this.buttonFmL.TabIndex = 35;
            this.buttonFmL.Text = "fm.l";
            this.buttonFmL.UseVisualStyleBackColor = true;
            this.buttonFmL.Click += new System.EventHandler(this.buttonFmL_Click);
            // 
            // progressBar
            // 
            this.progressBar.Location = new System.Drawing.Point(12, 662);
            this.progressBar.Name = "progressBar";
            this.progressBar.Size = new System.Drawing.Size(675, 20);
            this.progressBar.TabIndex = 37;
            // 
            // richTextBoxLog
            // 
            this.richTextBoxLog.Location = new System.Drawing.Point(12, 268);
            this.richTextBoxLog.Name = "richTextBoxLog";
            this.richTextBoxLog.Size = new System.Drawing.Size(767, 388);
            this.richTextBoxLog.TabIndex = 36;
            this.richTextBoxLog.Text = "";
            // 
            // buttonClear
            // 
            this.buttonClear.Location = new System.Drawing.Point(706, 663);
            this.buttonClear.Name = "buttonClear";
            this.buttonClear.Size = new System.Drawing.Size(73, 19);
            this.buttonClear.TabIndex = 38;
            this.buttonClear.Text = "Clear";
            this.buttonClear.UseVisualStyleBackColor = true;
            this.buttonClear.Click += new System.EventHandler(this.buttonClear_Click);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(12, 82);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(184, 13);
            this.label6.TabIndex = 40;
            this.label6.Text = "Смещение записи в принтер (DEC)";
            // 
            // textBoxOffset
            // 
            this.textBoxOffset.Location = new System.Drawing.Point(197, 79);
            this.textBoxOffset.Name = "textBoxOffset";
            this.textBoxOffset.Size = new System.Drawing.Size(56, 20);
            this.textBoxOffset.TabIndex = 39;
            this.textBoxOffset.Text = "-120";
            // 
            // buttonHelp
            // 
            this.buttonHelp.Location = new System.Drawing.Point(282, 105);
            this.buttonHelp.Name = "buttonHelp";
            this.buttonHelp.Size = new System.Drawing.Size(75, 23);
            this.buttonHelp.TabIndex = 41;
            this.buttonHelp.Text = "help";
            this.buttonHelp.UseVisualStyleBackColor = true;
            this.buttonHelp.Click += new System.EventHandler(this.buttonHelp_Click);
            // 
            // buttonFL
            // 
            this.buttonFL.Location = new System.Drawing.Point(282, 135);
            this.buttonFL.Name = "buttonFL";
            this.buttonFL.Size = new System.Drawing.Size(75, 23);
            this.buttonFL.TabIndex = 42;
            this.buttonFL.Text = "fl";
            this.buttonFL.UseVisualStyleBackColor = true;
            this.buttonFL.Click += new System.EventHandler(this.buttonFL_Click);
            // 
            // buttonBigLit
            // 
            this.buttonBigLit.Location = new System.Drawing.Point(221, 164);
            this.buttonBigLit.Name = "buttonBigLit";
            this.buttonBigLit.Size = new System.Drawing.Size(136, 23);
            this.buttonBigLit.TabIndex = 43;
            this.buttonBigLit.Text = "Перевернуть Big/Lit";
            this.buttonBigLit.UseVisualStyleBackColor = true;
            this.buttonBigLit.Click += new System.EventHandler(this.buttonBigLit_Click);
            // 
            // buttonFindCRCStart
            // 
            this.buttonFindCRCStart.Location = new System.Drawing.Point(221, 193);
            this.buttonFindCRCStart.Name = "buttonFindCRCStart";
            this.buttonFindCRCStart.Size = new System.Drawing.Size(136, 23);
            this.buttonFindCRCStart.TabIndex = 44;
            this.buttonFindCRCStart.Text = "Найти начало для CRC";
            this.buttonFindCRCStart.UseVisualStyleBackColor = true;
            this.buttonFindCRCStart.Click += new System.EventHandler(this.buttonFindCRCStart_Click);
            // 
            // textBoxCRC
            // 
            this.textBoxCRC.Location = new System.Drawing.Point(159, 196);
            this.textBoxCRC.Name = "textBoxCRC";
            this.textBoxCRC.Size = new System.Drawing.Size(56, 20);
            this.textBoxCRC.TabIndex = 46;
            this.textBoxCRC.Text = "40074";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(90, 199);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(63, 13);
            this.label10.TabIndex = 47;
            this.label10.Text = "Адрес CRC";
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(24, 228);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(69, 13);
            this.label11.TabIndex = 50;
            this.label11.Text = "Старт блока";
            // 
            // textBoxCRCStart
            // 
            this.textBoxCRCStart.Location = new System.Drawing.Point(93, 225);
            this.textBoxCRCStart.Name = "textBoxCRCStart";
            this.textBoxCRCStart.Size = new System.Drawing.Size(56, 20);
            this.textBoxCRCStart.TabIndex = 49;
            this.textBoxCRCStart.Text = "10078";
            // 
            // buttonCorrectCRC
            // 
            this.buttonCorrectCRC.Location = new System.Drawing.Point(221, 222);
            this.buttonCorrectCRC.Name = "buttonCorrectCRC";
            this.buttonCorrectCRC.Size = new System.Drawing.Size(136, 23);
            this.buttonCorrectCRC.TabIndex = 48;
            this.buttonCorrectCRC.Text = "Скорректировать CRC";
            this.buttonCorrectCRC.UseVisualStyleBackColor = true;
            this.buttonCorrectCRC.Click += new System.EventHandler(this.buttonCorrectCRC_Click);
            // 
            // checkBoxCRC
            // 
            this.checkBoxCRC.AutoSize = true;
            this.checkBoxCRC.Location = new System.Drawing.Point(159, 228);
            this.checkBoxCRC.Name = "checkBoxCRC";
            this.checkBoxCRC.Size = new System.Drawing.Size(61, 17);
            this.checkBoxCRC.TabIndex = 51;
            this.checkBoxCRC.Text = "в файл";
            this.checkBoxCRC.UseVisualStyleBackColor = true;
            // 
            // buttonFlash
            // 
            this.buttonFlash.Location = new System.Drawing.Point(93, 137);
            this.buttonFlash.Name = "buttonFlash";
            this.buttonFlash.Size = new System.Drawing.Size(73, 19);
            this.buttonFlash.TabIndex = 52;
            this.buttonFlash.Text = "Flash";
            this.buttonFlash.UseVisualStyleBackColor = true;
            this.buttonFlash.Click += new System.EventHandler(this.buttonFlash_Click);
            // 
            // HDTool2
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(791, 694);
            this.Controls.Add(this.buttonFlash);
            this.Controls.Add(this.checkBoxCRC);
            this.Controls.Add(this.label11);
            this.Controls.Add(this.textBoxCRCStart);
            this.Controls.Add(this.buttonCorrectCRC);
            this.Controls.Add(this.label10);
            this.Controls.Add(this.textBoxCRC);
            this.Controls.Add(this.buttonFindCRCStart);
            this.Controls.Add(this.buttonBigLit);
            this.Controls.Add(this.buttonFL);
            this.Controls.Add(this.buttonHelp);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.textBoxOffset);
            this.Controls.Add(this.buttonClear);
            this.Controls.Add(this.progressBar);
            this.Controls.Add(this.richTextBoxLog);
            this.Controls.Add(this.buttonFmL);
            this.Controls.Add(this.labelSize);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.buttonSendN);
            this.Controls.Add(this.buttonConnection);
            this.Controls.Add(this.textBoxComPort);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.textBoxAddress2);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.textBoxAddress);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.FileWay);
            this.Name = "HDTool2";
            this.Text = "HDTool2";
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox FileWay;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Button buttonEditADR;
        private System.Windows.Forms.Button buttonEditB;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox textBoxADRResult;
        private System.Windows.Forms.Button buttonADR;
        private System.Windows.Forms.TextBox textBoxBResult;
        private System.Windows.Forms.Button buttonB;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.TextBox textBoxInst2;
        private System.Windows.Forms.TextBox textBoxInst1;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBoxAddress;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textBoxAddress2;
        private System.Windows.Forms.TextBox textBoxComPort;
        private System.Windows.Forms.Button buttonConnection;
        private System.Windows.Forms.Button buttonSendN;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label labelSize;
        private System.Windows.Forms.Button buttonFmL;
        private System.Windows.Forms.ProgressBar progressBar;
        private System.Windows.Forms.RichTextBox richTextBoxLog;
        private System.Windows.Forms.Button buttonClear;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox textBoxOffset;
        private System.Windows.Forms.Button buttonHelp;
        private System.Windows.Forms.Button buttonFL;
        private System.Windows.Forms.Button buttonBigLit;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Button buttonFindCRCStart;
        private System.Windows.Forms.TextBox textBoxCRC;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.TextBox textBoxCRCStart;
        private System.Windows.Forms.Button buttonCorrectCRC;
        private System.Windows.Forms.CheckBox checkBoxCRC;
        private System.Windows.Forms.Button buttonFlash;
    }
}


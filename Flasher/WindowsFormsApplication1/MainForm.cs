using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApplication1
{
    public partial class HDTool2 : Form
    {
        public HDTool2()
        {
            InitializeComponent();
            
        }
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            recalculateSize();
        }
        protected override void OnClosing(CancelEventArgs e)
        {
            base.OnClosing(e);
            if (sp != null && sp.IsOpen)
            {
                sp.BaseStream.Flush();
                sp.Close();
            }
        }
        SerialPort sp = null;
        bool connectionOpen = false;
        private void buttonCon_Click(object sender, EventArgs e)
        {
            if (connectionOpen==false)
            {
                try
                {
                    sp = new SerialPort(textBoxComPort.Text.Trim());
                    sp.BaudRate = 115200;
                    sp.Parity = Parity.None;
                    sp.DataBits = 8;
                    sp.Open();
                    sp.DtrEnable = true;
                    sp.BaseStream.Flush();
                    sp.DataReceived += new SerialDataReceivedEventHandler(sp_DataReceived);

                    connectionOpen = true;
                    buttonConnection.Text = "Close";
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.ToString());
                }
            }
            else
            {
                try
                {
                    if (sp != null && sp.IsOpen)
                    {
                        sp.BaseStream.Flush();
                        sp.Close();
                    }
                    connectionOpen = false;
                    buttonConnection.Text = "Open";
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.ToString());
                }
            }
        }
        
        
        #region common
        public delegate void enableButtonDelegate(Button button);
        void enableButton(Button button)
        {
            if (button.InvokeRequired)
            {
                button.Invoke(new enableButtonDelegate(enableButton), button);
                return;
            }
            button.Enabled = true;
        }
        public delegate void updateProgress(int value);
        public void DoUpdateProgress(int value)
        {
            if (progressBar.InvokeRequired)
            {
                progressBar.Invoke(new updateProgress(DoUpdateProgress), value);
                return;
            }
            progressBar.Value = value;
        }
        void sp_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            try
            {
                int length = sp.BytesToRead;
                byte[] buf = new byte[length];
                sp.Read(buf, 0, length);

                addBytes(buf);

                //string s = Encoding.ASCII.GetString(buf);
                //addText(s);

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString(), "On receive");
            }
        }
        public delegate void addBytesDelegate(byte[] bytes);
        public event addBytesDelegate OnBytesAdded;

        public delegate void addTextDelegate(string text);
        public event addTextDelegate OnTextAdded;
        void addBytes(byte[] bytes)
        {
            if (OnBytesAdded != null)
            {
                OnBytesAdded(bytes);
            }
        }
        void addText(string text)
        {

            if (richTextBoxLog.InvokeRequired)
            {
                richTextBoxLog.Invoke(new addTextDelegate(addText), text);
                return;
            }
            richTextBoxLog.AppendText(text);
            richTextBoxLog.SelectionStart = richTextBoxLog.Text.Length;
            richTextBoxLog.ScrollToCaret();
            if (OnTextAdded != null)
            {
                OnTextAdded(text);
            }
        }
        private void buttonClear_Click(object sender, EventArgs e)
        {
            richTextBoxLog.Clear();
        }
        #endregion


        bool sendingN = false;
        private void buttonSendN_Click(object sender, EventArgs e)
        {
            if (sendingN == false)
            {
                sendingN = true;
                Thread workThread = new Thread(new ThreadStart(doSendN));
                workThread.IsBackground = true;
                workThread.Start();
                buttonSendN.Text = "Stop";
            }
            else if (sendingN == true)//Stop send N
            {
                sendingN = false;
                buttonSendN.Text = "Send N";
            }
        }
        void doSendN()
        {
            try
            {

                while (sendingN)
                {
                    string n = "N";
                    if (sp != null)
                    {
                        sp.Write(n);
                    }
                    //addText(n);
                    Thread.Sleep(500);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
        }


     


        Regex rDump = new Regex(@"(?<address>[0-9,A-F]{8})(?<dig>[ ]{1,5}[0-9,A-F]{2}){16}",
                    RegexOptions.IgnoreCase);
        Regex rProbe = new Regex(@"(pROBE\+>)|(vxshell>)",
                    RegexOptions.Multiline | RegexOptions.IgnoreCase);

        #region address
        private void textBoxAddress_TextChanged(object sender, EventArgs e)
        {
            recalculateSize();
        }

        private void textBoxAddress2_TextChanged(object sender, EventArgs e)
        {
            recalculateSize();
        }

        void recalculateSize()
        {
            try
            {
                uint address1 = uint.Parse(textBoxAddress.Text,
                NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                uint address2 = uint.Parse(textBoxAddress2.Text,
                NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                if (address2 > address1)
                {
                    uint size = address2 - address1;
                    labelSize.Text = size.ToString("X6");
                }
                else
                {
                    labelSize.Text = "";
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
        }
        #endregion

        #region fm.l
        private void buttonFmL_Click(object sender, EventArgs e)
        {
            try
            {
                
                fmaddressFrom = int.Parse(textBoxAddress.Text,
                NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                fmaddressTo = int.Parse(textBoxAddress2.Text,
                NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                fmaddressOffset = int.Parse(textBoxOffset.Text, NumberStyles.Integer);
                progressBar.Minimum = fmaddressFrom;
                progressBar.Maximum = fmaddressTo;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }

            buttonFmL.Enabled = false;
            Thread workThread = new Thread(new ThreadStart(doFmL));
            workThread.IsBackground = true;
            workThread.Start();
        }



        int fmaddressFrom;
        int fmaddressOffset;
        int fmaddressTo;
        bool fmWaitReply = true;
        addTextDelegate dr;
        void doFmL()
        {
            try
            {
                uint addressDst = (uint)(fmaddressFrom + fmaddressOffset);
                int size = (int)(fmaddressTo - fmaddressFrom);
                sp.BaseStream.Flush();
                fmSb = new StringBuilder();
                dr = new addTextDelegate(controllFilling);
                this.OnTextAdded += dr;
                byte[] file = File.ReadAllBytes(FileWay.Text);

                for (int i = 0; i < size; i += 4)
                {
                    string command = String.Format(
                                    "fm.l {0} 1 {1}\r\n", (addressDst + i).ToString("X8"),
                                    BitConverter.ToUInt32(file, fmaddressFrom + i).ToString("X8"));
                    DoUpdateProgress(fmaddressFrom+i);
                    sp.BaseStream.Flush();
                    fmWaitReply = true;
                    sp.Write(command);
                    sp.BaseStream.Flush();

                    int sleepCounter = 0;
                    Thread.Sleep(50);
                    while (fmWaitReply)
                    {
                        Thread.Sleep(100);
                        sleepCounter++;
                        if (sleepCounter > 50) break;
                    }
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
            finally
            {
                if (dr != null)
                {
                    this.OnTextAdded -= dr;
                }
                DoUpdateProgress(fmaddressFrom);
            }
            enableButton(buttonFmL);
        }
        StringBuilder fmSb;
        Regex fmRegFill = new Regex("filling the memory from 0x(?<address>[0-9,A-F]{8})");
        void controllFilling(string text)
        {
            try
            {
                //filling the memory from 0x0002378C to 0x00023790 with 0xE92D43FE 
                fmSb.Append(text);
                Match m = fmRegFill.Match(fmSb.ToString());
                if (m.Success)
                {
                    string value = m.Groups["address"].Value;
                    fmWaitReply = false;
                    fmSb.Clear();
                    //addText(s);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString(), "On receive FM.L");
            }
        }
        #endregion

        #region address calc
        private void buttonB_Click(object sender, EventArgs e)
        {
            int codeStart = 0;
            int codeSize = 0;
            int codeStop = 0;
            int result = 0;
            try
            {
                codeStart = int.Parse(textBoxInst1.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                codeStop = int.Parse(textBoxInst2.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                codeSize = (codeStop - codeStart) / 4;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
                return;
            }
            result = (codeSize - 2);// &0x00FFFFFF;
            textBoxBResult.Text = result.ToString("X8");
        }

        private void buttonADR_Click(object sender, EventArgs e)
        {
            int codeStart = 0;
            int codeSize = 0;
            int codeStop = 0;
            int result = 0;
            try
            {
                codeStart = int.Parse(textBoxInst1.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                codeStop = int.Parse(textBoxInst2.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                codeSize = (codeStop - codeStart);
                if (codeSize > 0x0FFF) throw new Exception("Больше 12 бит");
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
                return;
            }
            result = (codeSize - 8) & 0x00000FFF;
            textBoxADRResult.Text = result.ToString("X8");
        }

        private void buttonEditB_Click(object sender, EventArgs e)
        {
            //Little endian 4C B5 FF EB
            int codeStart = 0;
            try
            {
                codeStart = int.Parse(textBoxInst1.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                int offset = int.Parse(textBoxBResult.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                FileStream fs = File.Open(FileWay.Text, FileMode.Open, FileAccess.ReadWrite);
                byte[] boffset = BitConverter.GetBytes(offset);
                fs.Position = codeStart;
                fs.Write(boffset, 0, 3);
                fs.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
                return;
            }
        }

        private void buttonEditADR_Click(object sender, EventArgs e)
        {
            //Little endian 4C B5 FF EB
            int codeStart = 0;
            try
            {
                codeStart = int.Parse(textBoxInst1.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                int offset = int.Parse(textBoxADRResult.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                FileStream fs = File.Open(FileWay.Text, FileMode.Open, FileAccess.ReadWrite);
                byte[] tmpFileBytes=new byte[4];
                fs.Position = codeStart;
                fs.Read(tmpFileBytes, 0, 2);
                byte[] boffset = BitConverter.GetBytes(offset);
                boffset[1] &= 0x0F;//отбрасываем старшую часть байта
                boffset[1] |= tmpFileBytes[1]; //восстанавливаем инструкцию
                fs.Position = codeStart;
                fs.Write(boffset, 0, 2);
                fs.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
                return;
            }
        }
        #endregion

        private void buttonHelp_Click(object sender, EventArgs e)
        {
            try
            {
                string n = "help\r\n";
                if (sp != null && sp.IsOpen)
                {
                    sp.BaseStream.Flush();
                    sp.Write(n);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
        }

        private void buttonFL_Click(object sender, EventArgs e)
        {
            try
            {
                string n = "fl\r\n";
                if (sp != null && sp.IsOpen)
                {
                    sp.BaseStream.Flush();
                    sp.Write(n);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
        }

        private void buttonBigLit_Click(object sender, EventArgs e)
        {
            try
            {
                byte[] file = File.ReadAllBytes(FileWay.Text);
                for (int i = 0; i < file.Length; i += 4)
                {
                    uint v = BitConverter.ToUInt32(file, i);
                    file[i] = (byte)(v >> 24);
                    file[i + 1] = (byte)(v >> 16);
                    file[i + 2] = (byte)(v >> 8);
                    file[i + 3] = (byte)v;
                }
                File.WriteAllBytes(FileWay.Text, file);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
        
        }

        ushort getUInt16(byte[] file, int offset)
        {
            ushort result = 0;
            result |= (ushort)(file[offset] << 8);
            result |= file[offset + 1];
            return result;
        }
        byte[] getBytes(UInt16 value)
        {
            byte[] array = new byte[2];
            array[0] = (byte)(value >> 8);
            array[1] = (byte)value;
            return array;
        }
        /// <summary>
        /// Все байты (по два UInt16) от начального до срс его включая
        /// по сумме дают 0хА5А5
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void buttonFindCRCStart_Click(object sender, EventArgs e)
        {
            try
            {
                int adrCRC = int.Parse(textBoxCRC.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);
                byte[] file = File.ReadAllBytes(FileWay.Text);
                UInt16 crc = getUInt16(file, adrCRC);
                UInt16 tmp = 0;
                for (int i = adrCRC; i > 0; i -= 2)
                {
                    UInt16 v = getUInt16(file, i);
                    tmp += v;
                    if (tmp == (UInt16)0xA5A5)
                    {
                        addText(String.Format("Adress start {0}\r\n", i.ToString("X8")));
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
        }

        private void buttonCorrectCRC_Click(object sender, EventArgs e)
        {
            FileStream fs=null;
            try
            {
                int adrStart = int.Parse(textBoxCRCStart.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);

                int adrCRC = int.Parse(textBoxCRC.Text,
                    NumberStyles.HexNumber | NumberStyles.AllowHexSpecifier);

                byte[] file = File.ReadAllBytes(FileWay.Text);

                UInt16 tmp = 0;
                for (int i = adrStart; i < adrCRC; i += 2)
                {
                    UInt16 v = getUInt16(file, i);
                    tmp += v;
                }

                UInt16 crc2 = (UInt16)((Int32)0xA5A5 - (Int16)tmp);
                addText(String.Format("Calculated {0}\r\n", crc2.ToString("X4")));

                byte[] tmpBytes = getBytes(crc2);
                if (checkBoxCRC.Checked)
                {
                    fs = File.Open(FileWay.Text, FileMode.Open, FileAccess.ReadWrite);
                    fs.Position = adrCRC;
                    fs.Write(tmpBytes, 0, 2);
                    addText(String.Format("Writed 0x{0} 0x{1}\r\n", tmpBytes[0].ToString("X2"),
                        tmpBytes[1].ToString("X2")));
                }              
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
            finally
            {
                if (fs != null) fs.Close();
            }
        }

        private void buttonFlash_Click(object sender, EventArgs e)
        {
  
            buttonFlash.Enabled = false;
            progressBar.Minimum = 0;
            progressBar.Maximum = File.ReadAllBytes(FileWay.Text).Length;  
            Thread workThread = new Thread(new ThreadStart(doFlash));
            workThread.IsBackground = true;
            workThread.Start();
        }

        void controllFilling(byte[] bytes)
        {
            try
            {
                int size = bytes.Length;
                for (int i = 0; i < bytes.Length;i++ )
                {
                    if (bytes[i] == 0xB1)
                    {
                        if (size - i >= 10)//10-минимальный размер пакета
                        {
                            if (bytes[i + 3] == 4) //write complete
                            {
                                fmWaitReply = false;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString(), "On receive FM.L");
            }
        }
        void doFlash()
        {
            addBytesDelegate dr=null;
            try
            {
                dr = new addBytesDelegate(controllFilling);
                this.OnBytesAdded += dr;

                sp.BaseStream.Flush();
                byte[] file = File.ReadAllBytes(FileWay.Text);
                int fileSize = file.Length;


                for (int i = 0; i < fileSize; i += 256)
                {
                    DoUpdateProgress(i);
                    sp.BaseStream.Flush();
                    ushort packetSize=2 + 1 + 4 + 256 + 1 + 1;//265
                    byte[] buf = new byte[1+packetSize];
                    
                    buf[0] = 0xB1;
                    buf[1] = (byte)packetSize;
                    buf[2] = (byte)(packetSize >> 8);
                    buf[3] = 3;//Wirte page command
                    buf[4] = (byte)i;
                    buf[5] = (byte)(i>>8);
                    buf[6] = (byte)(i >> 16);
                    buf[7] = (byte)(i >> 24);
                    
                    byte crc = 0;
                    for (int j = 0; j < 256; j++)
                    {
                        crc += file[i + j];
                        buf[8 + j] = file[i + j];
                    }

                    buf[8 + 256] = crc;
                    buf[9 + 256] = (byte)(crc^0xAA);

                    fmWaitReply = true;
                    sp.Write(buf,0,1+packetSize);
                    sp.BaseStream.Flush();

                    int sleepCounter = 0;
                    Thread.Sleep(50);
                    while (fmWaitReply)
                    {
                        Thread.Sleep(100);
                        sleepCounter++;
                        if (sleepCounter > 20) break;
                    }
                    
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
            finally
            {
                if (dr != null)
                {
                    this.OnBytesAdded -= dr;
                }
                DoUpdateProgress(0);
            }
            enableButton(buttonFlash);
        }


    }
}

const { exec } = require('child_process');
const iconv = require('iconv-lite');

let txt = '春风又绿江南岸，明月何时照我还；仰天大笑出门去，柳岸花明又一村';
// txt = 'English is a good language';
exec(`powershell.exe Add-Type -AssemblyName System.speech; $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.Rate = 1; $speak.Speak([Console]::In.ReadLine()); exit`).stdin.end(iconv.encode(txt, 'gbk'));
// txt = '你何时才还我的200万呀';
// txt = '这里有几家银行';
// exec(`powershell.exe Add-Type -AssemblyName System.speech; $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.Rate = 2; $speak.Speak([Console]::In.ReadLine()); exit`).stdin.end(iconv.encode(txt, 'gbk'));

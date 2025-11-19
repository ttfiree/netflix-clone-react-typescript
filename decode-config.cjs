const fs = require('fs');

const base64Data = "eyJzdGF0dXMiOiIxIiwiZnJvbSI6ImpzbTN1OCIsInNob3ciOiJcdTY3ODFcdTkwMWZtM3U4IiwiZGVzIjoiXHU1Yjk4XHU2NWI5XHU1NzMwXHU1NzQwamlzdXp5LmNvbSIsInRhcmdldCI6Il9zZWxmIiwicHMiOiIxIiwicGFyc2UiOiJodHRwczpcL1wvanNqaWV4aS5jb21cL3BsYXlcLz91cmw9Iiwic29ydCI6IjE5OTkiLCJ0aXAiOiJcdTkwNDdcdTUyMzBcdTk1ZWVcdTk4OThcdThiZjdcdTgwNTRcdTdjZmJcdTViOThcdTY1YjlcdTdmYTRcdTdlYzQsXHU2MjgwXHU2NzJmXHU2NTJmXHU2MzAxXHUzMDAyIiwiaWQiOiJqc20zdTgiLCJjb2RlIjoiTWFjUGxheWVyLkh0bWwgPSAnPGlmcmFtZSB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgc3JjPVwiaHR0cHM6XC9cL2pzamlleGkuY29tXC9wbGF5XC8/dXJsPScrTWFjUGxheWVyLlBsYXlVcmwrJ1wiIGZyYW1lYm9yZGVyPVwiMFwiIGJvcmRlcj1cIjBcIiBtYXJnaW53aWR0aD1cIjBcIiBtYXJnaW5oZWlnaHQ9XCIwXCIgc2Nyb2xsaW5nPVwibm9cIiBhbGxvd2Z1bGxzY3JlZW49XCJhbGxvd2Z1bGxzY3JlZW5cIiBtb3phbGxvd2Z1bGxzY3JlZW49XCJtb3phbGxvd2Z1bGxzY3JlZW5cIiBtc2FsbG93ZnVsbHNjcmVlbj1cIm1zYWxsb3dmdWxsc2NyZWVuXCIgb2FsbG93ZnVsbHNjcmVlbj1cIm9hbGxvd2Z1bGxzY3JlZW5cIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW49XCJ3ZWJraXRhbGxvd2Z1bGxzY3JlZW5cIj48XC9pZnJhbWU+JztcclxuTWFjUGxheWVyLlNob3coKTsifQ==";

const decoded = Buffer.from(base64Data, 'base64').toString('utf-8');
const data = JSON.parse(decoded);

console.log('=== 苹果CMS jsm3u8 播放器配置 ===\n');
console.log('ID:', data.id);
console.log('播放器类型:', data.from);
console.log('解析接口:', data.parse);
console.log('状态:', data.status);
console.log('排序:', data.sort);
console.log('\n显示名称 (Unicode):', data.show);
console.log('描述 (Unicode):', data.des);
console.log('提示 (Unicode):', data.tip);

console.log('\n=== 播放器代码 ===');
console.log(data.code);

console.log('\n=== 关键信息 ===');
console.log('✅ 官方推荐的解析接口:', data.parse);
console.log('✅ 这个接口就是我们已经在使用的 JSJiexi');

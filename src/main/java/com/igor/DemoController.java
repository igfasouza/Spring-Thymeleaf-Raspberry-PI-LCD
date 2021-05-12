package com.igor;

import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ibasco.ucgdisplay.drivers.glcd.Glcd;
import com.ibasco.ucgdisplay.drivers.glcd.GlcdConfig;
import com.ibasco.ucgdisplay.drivers.glcd.GlcdConfigBuilder;
import com.ibasco.ucgdisplay.drivers.glcd.GlcdDriver;
import com.ibasco.ucgdisplay.drivers.glcd.GlcdOption;
import com.ibasco.ucgdisplay.drivers.glcd.enums.GlcdCommProtocol;
import com.ibasco.ucgdisplay.drivers.glcd.enums.GlcdPin;
import com.ibasco.ucgdisplay.drivers.glcd.enums.GlcdRotation;
import com.ibasco.ucgdisplay.drivers.glcd.enums.Provider;

import java.io.IOException;
import java.util.BitSet;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;


@Controller
public class DemoController{

	@Autowired
	private ApplicationContext applicationContext;
	
	private GlcdConfig config;
	private GlcdDriver driver;

	public void loadResources() {

		try {
			Resource[] resources = applicationContext.getResources("classpath:/*.xbm");
		} catch (IOException ex) {
			ex.printStackTrace();
		}

	}

	@RequestMapping("/")
	public String index(){

		loadResources();
		
		// - MOSI = 10
		// - SCLK = 11
		// - CE1 = 7
		config = GlcdConfigBuilder
				//Use ST7920 - 128 x 64 display, SPI 4-wire Hardware
				.create(Glcd.ST7920.D_128x64, GlcdCommProtocol.SPI_SW_4WIRE_ST7920)
				//Set to 180 rotation
				.option(GlcdOption.ROTATION, GlcdRotation.ROTATION_180)
				.option(GlcdOption.PROVIDER, Provider.SYSTEM)
				.mapPin(GlcdPin.SPI_MOSI, 19)
				.mapPin(GlcdPin.SPI_CLOCK, 13)
				.mapPin(GlcdPin.CS, 26)
				.build();
		
		driver = new GlcdDriver(config);

		//returns to index.html
		return"index";
	}

	@RequestMapping(value="/save", method=RequestMethod.POST)
	public String save(@ModelAttribute User user) throws Exception{

		String str[] = user.getArea().split(",");
		int[] bits = new int[str.length];
		for (int i = 0; i < str.length; i++) {
			String tmp = str[i].replace("0x", "").trim();
			bits[i] = Integer.parseInt(tmp);
		}

		byte[] tmp = encodeToByteArray(bits);
		run(tmp);

		return "index";
	}

	private void run(byte[] xmb) throws Exception {
		//width - height
		driver.drawXBM(0, 0, 128, 64, xmb);
		driver.sendBuffer();
		Thread.sleep(10000);
		driver.clearDisplay();
	}
	
	private static byte[] encodeToByteArray(int[] bits) {
	    BitSet bitSet = new BitSet(bits.length);
	    for (int index = 0; index < bits.length; index++) {
	        bitSet.set(index, bits[index] > 0);
	    }

	    return bitSet.toByteArray();
	}

}
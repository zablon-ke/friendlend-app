/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mathclass;

import javax.swing.JOptionPane;

/**
 *
 * @author user
 */
import javax.swing.JOptionPane;
public class Mathclass {

    /**
     * @param args the command line arguments
     */
    
    public static void main(String[] args)
    { 
    JOptionPane.showMessageDialog(null,"FIND AREA OF CIRCLE","BIT/0005/18",JOptionPane.QUESTION_MESSAGE);
    double rad;
    double Area;
    String radString;
    String outputStr;
    radString=JOptionPane.showInputDialog(null,"ENTER THE RADIUS:","BIT/0005/18",JOptionPane.QUESTION_MESSAGE);
    rad=Double.parseDouble(radString);
    Area=Math.PI*Math.pow(rad,2);
    outputStr=("radius:"+rad+"\n"+"Area"+Math.PI*Math.pow(rad,2));
    JOptionPane.showMessageDialog(null,outputStr,"BIT/0005/18",JOptionPane.INFORMATION_MESSAGE);
    System.exit(0);
    }
        // TODO code application logic here
    }
    


import React, { useState,useEffect } from 'react';
import {format} from 'date-fns';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from'recharts';


const Chart = ({data,visible}) => {
    const [formattedData,setFormattedData] = useState([]);

    useEffect(() => {
        if (data && data.length > 0) {
          const processedData = data
            .map((entry) => ({
                DateTime: Number(new Date(entry.DateTime)),
                ENTSOE_DE_DAM_Price: entry["ENTSOE_DE_DAM_Price"]
                ? parseFloat(entry["ENTSOE_DE_DAM_Price"])
                : null,
              ENTSOE_GR_DAM_Price: entry["ENTSOE_GR_DAM_Price"]
                ? parseFloat(entry["ENTSOE_GR_DAM_Price"])
                : null,
              ENTSOE_FR_DAM_Price: entry["ENTSOE_FR_DAM_Price"]
                ? parseFloat(entry["ENTSOE_FR_DAM_Price"])
                : null,
            }))
            .sort((a, b) => a.DateTime - b.DateTime);

          setFormattedData(processedData);
        }
      }, [data]);

    if(formattedData.length===0){
        return (
            <div className='text-center text-blue-600 text-lg p-4'>
                ⏳Loading Data...
            </div>
        )
    }
    
  return ( 
    <div className='w-full bg-gradient-to-r from-purple-600 to-blue-500 p-4 rounded-lg shadow-lg'>
        <h3 className='text-xl font-bold text-center text-gray-700 mb-6'>
            Prices Over Time
        </h3>
        <ResponsiveContainer height={400} width="100%">
            <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis
                dataKey="DateTime"
                angle={-20}
                tickFormatter={(tick) => format(new Date(tick),"dd-MM-yy, HH:mm")}
                textAnchor='end'
                tick={{ fill: "#FFD700", fontSize: 14, fontWeight: "bold" }}
                />
                <YAxis
                ticks={[0,20,40,60,80,100,120,140]}
                allowDataOverflow={true}
                tick={{ fill: "#FFD700", fontSize: 14, fontWeight: "bold" }} 
                />
                <Tooltip labelFormatter={(label) => format(new Date(label), "dd-MM-yyyy HH:mm")} />
                <Legend
                wrapperStyle={{paddingTop:20}}
                />
                {visible.Germany && (
                  <Line
                  type="monotone"
                  dataKey="ENTSOE_DE_DAM_Price"
                  name='Germany'
                  dot={false}
                  stroke='#FF5733'
                  strokeWidth={4}
                  />
                )}
                {visible.Greece && (
                  <Line
                  type="monotone"
                  dataKey="ENTSOE_GR_DAM_Price"
                  name='Greece'
                  dot={false}
                  stroke='#33FF57'
                  strokeWidth={4}
                  />
                )}
                {visible.France && (
                  <Line
                  type="monotone"
                  dataKey="ENTSOE_FR_DAM_Price"
                  name='France'
                  dot={false}
                  stroke='#4423FF'
                  strokeWidth={4}
                  />
                )}
              </LineChart>
        </ResponsiveContainer>
    </div>
  )
}

export default Chart; 
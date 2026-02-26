const s="a73f78bfdf014a2e9b4a69e99e6df4dc.W25Q8hNZIDRJAn40Q0YhPeKO",a="http://localhost:11434/v1",n="llama3";class c{async callLLM(t,o=!1){try{const e=await fetch(`${a}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify({model:n,messages:t,temperature:.7,response_format:o?{type:"json_object"}:void 0})});if(!e.ok)throw new Error(`LLM API Error: ${e.statusText}`);return(await e.json()).choices[0]?.message?.content||""}catch(e){throw console.error("LLM Service Failed:",e),e}}async chat(t,o=""){const e=[{role:"system",content:`You are the Whitelines AI Security Assistant. 
                Your goal is to help users with cybersecurity questions, product info, and platform navigation.
                
                CONTEXT:
                ${o}
                
                Be professional, concise, and helpful. If you don't know something, advise contacting support.
                Do not facilitate malicious activity.`},...t];return this.callLLM(e)}async analyzeSecurityLog(t){const o=`
        Analyze the following security log event and provide a structured JSON response.
        
        LOG DETAILS:
        - Event ID: ${t.eventID}
        - Severity: ${t.severity}
        - Message: ${t.message}
        - Source: ${t.source}
        - Category: ${t.category}

        You must return valid JSON with these fields:
        {
            "summary": "Brief explanation of what happened",
            "rootCause": "The likely technical cause (e.g., Brute Force, Misconfiguration)",
            "remediationSteps": ["Step 1", "Step 2", "Step 3"],
            "confidenceScore": 0.95 (number between 0 and 1)
        }
        `,e=[{role:"system",content:"You are a Tier 3 Security Analyst AI. You output strict JSON only."},{role:"user",content:o}];try{const r=await this.callLLM(e,!0);return JSON.parse(r)}catch(r){throw r}}}const l=new c;export{c as LLMService,l as llmService};

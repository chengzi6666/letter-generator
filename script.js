// 信件生成器JavaScript逻辑文件

// 全局变量
let currentTemplate = 'template1';
let customBackgroundImage = null;
let textPosition = { x: 0, y: 0 };
let templatePosition = { x: 0, y: 0 };
let templateSize = 100;
let isDraggingText = false;
let isDraggingTemplate = false;
let dragStartX = 0;
let dragStartY = 0;
let generatedLetters = [];
let customLetterContent = '';

// 年级模板数据
const gradeTemplates = {
    'L1': {
        content: '亲爱的XX同学：\n\n    你好！\n\n    这是一封给L1级别的测试信件。\n\n此致\n敬礼！\n\nXX老师',
        teachers: ['天贻老师', '一凡老师', '杨洋老师']
    },
    'L2': {
        content: '亲爱的XX同学：\n\n    你好！\n\n    这是一封给L2级别的测试信件。\n\n此致\n敬礼！\n\nXX老师',
        teachers: ['天贻老师', '一凡老师', '杨洋老师', '小雨老师']
    },
    'L3': {
        content: '亲爱的XX同学：\n\n    你好！\n\n    这是一封给L3级别的测试信件。\n\n此致\n敬礼！\n\nXX老师',
        teachers: ['天贻老师', '一凡老师', '杨洋老师', '小雨老师', '可乐老师']
    },
    'L4': {
        content: '亲爱的XX同学：\n\n    你好！\n\n    这是一封给L4级别的测试信件。\n\n此致\n敬礼！\n\nXX老师',
        teachers: ['天贻老师', '一凡老师', '杨洋老师', '小雨老师', '可乐老师', '柠檬老师']
    },
    'L5': {
        content: '亲爱的XX同学：\n\n    你好！\n\n    这是一封给L5级别的测试信件。\n\n此致\n敬礼！\n\nXX老师',
        teachers: ['天贻老师', '一凡老师', '杨洋老师', '小雨老师', '可乐老师', '柠檬老师', '西瓜老师']
    }
};

// 初始化应用
function init() {
    // 获取DOM元素
    const templateOptions = document.querySelectorAll('.template-option');
    const customBgUpload = document.getElementById('custom-bg-upload');
    const gradeOptions = document.querySelectorAll('.grade-option');
    const fontFamilySelect = document.getElementById('font-family');
    const fontBoldCheckbox = document.getElementById('font-bold');
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const fontColorPicker = document.getElementById('font-color');
    const highlightColorPicker = document.getElementById('highlight-color');
    const applyHighlightBtn = document.getElementById('apply-highlight');
    const marginTopSlider = document.getElementById('margin-top');
    const marginTopValue = document.getElementById('margin-top-value');
    const marginRightSlider = document.getElementById('margin-right');
    const marginRightValue = document.getElementById('margin-right-value');
    const marginBottomSlider = document.getElementById('margin-bottom');
    const marginBottomValue = document.getElementById('margin-bottom-value');
    const marginLeftSlider = document.getElementById('margin-left');
    const marginLeftValue = document.getElementById('margin-left-value');
    const textContainer = document.getElementById('text-container');
    const templateContainer = document.getElementById('template-container');
    const templateSizeSlider = document.getElementById('template-size');
    const templateSizeValue = document.getElementById('template-size-value');
    const nameListInput = document.getElementById('name-list');
    const nameCountDisplay = document.getElementById('name-count');
    const letterContentInput = document.getElementById('letter-content');
    const teacherNameSelect = document.getElementById('teacher-name');
    const customTeacherNameInput = document.getElementById('custom-teacher-name');
    const letterPreview = document.getElementById('letter-preview');
    const letterContentPreview = document.getElementById('letter-content-preview');
    const downloadSingleBtn = document.getElementById('download-single');
    const generateAllBtn = document.getElementById('generate-all');
    const downloadAllBtn = document.getElementById('download-all');
    const generationStatus = document.getElementById('generation-status');
    const statusText = document.getElementById('status-text');

    // 设置事件监听器
    setupEventListeners();

    // 初始化预览
    updateLetterPreview();
    updateLetterBackground();

    // 初始化姓名计数
    updateNameCount();

    function setupEventListeners() {
        // 模板选择
        templateOptions.forEach(option => {
            option.addEventListener('click', () => {
                templateOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                currentTemplate = option.getAttribute('data-template');
                customBackgroundImage = null;
                updateLetterBackground();
            });
        });

        // 自定义背景上传
        customBgUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    customBackgroundImage = event.target.result;
                    updateLetterBackground();
                    templateOptions.forEach(opt => opt.classList.remove('selected'));
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        // 年级选择
        gradeOptions.forEach(option => {
            option.addEventListener('click', () => {
                gradeOptions.forEach(opt => {
                    opt.classList.remove('bg-primary', 'text-white');
                    opt.classList.add('bg-gray-200', 'text-gray-700');
                });
                option.classList.remove('bg-gray-200', 'text-gray-700');
                option.classList.add('bg-primary', 'text-white');
                applyGradeTemplate(option.getAttribute('data-grade'));
            });
        });

        // 信件内容变化
        letterContentInput.addEventListener('input', () => {
            updateLetterPreview();
        });

        // 老师姓名选择
        teacherNameSelect.addEventListener('change', () => {
            if (teacherNameSelect.value === 'custom') {
                customTeacherNameInput.classList.remove('hidden');
            } else {
                customTeacherNameInput.classList.add('hidden');
            }
            updateLetterPreview();
        });

        // 自定义老师姓名变化
        customTeacherNameInput.addEventListener('input', () => {
            updateLetterPreview();
        });

        // 字体选择
        fontFamilySelect.addEventListener('change', () => {
            updateLetterPreview();
        });

        // 字体加粗
        fontBoldCheckbox.addEventListener('change', () => {
            updateLetterPreview();
        });

        // 字号调整
        fontSizeSlider.addEventListener('input', () => {
            fontSizeValue.textContent = `${fontSizeSlider.value}px`;
            updateLetterPreview();
        });

        // 行间距调整
        const lineHeightSlider = document.getElementById('line-height');
        const lineHeightValue = document.getElementById('line-height-value');
        lineHeightSlider.addEventListener('input', () => {
            lineHeightValue.textContent = lineHeightSlider.value;
            updateLetterPreview();
        });

        // 字体颜色
        fontColorPicker.addEventListener('input', () => {
            updateLetterPreview();
        });

        // 应用高亮
        applyHighlightBtn.addEventListener('click', applyHighlightToSelection);

        // 边距调整
        marginTopSlider.addEventListener('input', () => {
            marginTopValue.textContent = `${marginTopSlider.value}px`;
            updateLetterPreview();
        });

        marginRightSlider.addEventListener('input', () => {
            marginRightValue.textContent = `${marginRightSlider.value}px`;
            updateLetterPreview();
        });

        marginBottomSlider.addEventListener('input', () => {
            marginBottomValue.textContent = `${marginBottomSlider.value}px`;
            updateLetterPreview();
        });

        marginLeftSlider.addEventListener('input', () => {
            marginLeftValue.textContent = `${marginLeftSlider.value}px`;
            updateLetterPreview();
        });

        // 文本拖拽事件
        textContainer.addEventListener('mousedown', function(e) {
            isDraggingText = true;
            dragStartX = e.clientX - textPosition.x;
            dragStartY = e.clientY - textPosition.y;
            textContainer.style.cursor = 'grabbing';
        });

        // 模板拖拽事件
        templateContainer.addEventListener('mousedown', function(e) {
            isDraggingTemplate = true;
            dragStartX = e.clientX - templatePosition.x;
            dragStartY = e.clientY - templatePosition.y;
            templateContainer.style.cursor = 'grabbing';
            e.stopPropagation(); // 防止触发文本拖拽
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (isDraggingText) {
                textPosition.x = e.clientX - dragStartX;
                textPosition.y = e.clientY - dragStartY;
                updateTextPosition();
            }

            if (isDraggingTemplate) {
                templatePosition.x = e.clientX - dragStartX;
                templatePosition.y = e.clientY - dragStartY;
                updateTemplatePosition();
            }
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', function() {
            isDraggingText = false;
            isDraggingTemplate = false;
            textContainer.style.cursor = 'grab';
            templateContainer.style.cursor = 'grab';
        });

        // 模板大小调整
        templateSizeSlider.addEventListener('input', function() {
            templateSize = parseInt(templateSizeSlider.value);
            templateSizeValue.textContent = `${templateSize}%`;
            updateTemplateSize();
        });

        // 下载当前信件
        downloadSingleBtn.addEventListener('click', downloadSingleLetter);

        // 生成所有信件
        generateAllBtn.addEventListener('click', generateAllLetters);

        // 打包下载全部信件
        downloadAllBtn.addEventListener('click', downloadAllLetters);
    }

    // 应用年级模板
    function applyGradeTemplate(grade) {
        // 保存当前内容
        customLetterContent = letterContentInput.value;

        // 更新信件内容
        if (gradeTemplates[grade]) {
            letterContentInput.value = gradeTemplates[grade].content;

            // 更新老师列表
            updateTeacherList(gradeTemplates[grade].teachers);
        }

        // 更新预览
        updateLetterPreview();
    }

    // 更新老师列表
    function updateTeacherList(teachers) {
        // 保存当前选中的老师
        const currentTeacher = getCurrentTeacherName();

        // 清空并重新填充老师列表
        teacherNameSelect.innerHTML = '';

        // 添加年级对应的老师
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher;
            option.textContent = teacher;
            teacherNameSelect.appendChild(option);
        });

        // 添加自定义选项
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = '自定义...';
        teacherNameSelect.appendChild(customOption);

        // 尝试恢复之前选中的老师
        if (currentTeacher && teacherNameSelect.querySelector(`option[value="${currentTeacher}"]`)) {
            teacherNameSelect.value = currentTeacher;
        } else if (customTeacherNameInput.value && currentTeacher === customTeacherNameInput.value) {
            teacherNameSelect.value = 'custom';
            customTeacherNameInput.classList.remove('hidden');
        } else {
            teacherNameSelect.value = teachers[0];
            customTeacherNameInput.classList.add('hidden');
        }
    }

    // 更新信件预览
    function updateLetterPreview() {
        // 获取当前信件内容并应用老师署名
        let content = letterContentInput.value;
        const teacherName = getCurrentTeacherName();
        // 确保只有署名部分被替换为老师姓名
        content = content.replace(/XX老师/g, teacherName);

        // 处理学员姓名显示方式（只在预览中显示单个姓名）
        const nameList = getNameList();
        if (nameList.length > 0) {
            let displayName = nameList[0];
            // 检查是否为中文姓名且长度大于2个汉字，并且未勾选显示全称
            if (!document.getElementById('show-full-name').checked && isChineseName(displayName) && displayName.length > 2) {
                // 只显示最后两个字
                displayName = displayName.substring(displayName.length - 2);
            }
            content = content.replace(/XX/g, displayName);
        }

        // 应用格式：称呼左顶格，正文每段开头空两格，署名右顶格
        const formattedContent = formatLetterContent(content);

        // 设置预览内容
        letterContentPreview.innerHTML = formattedContent;

        // 应用样式
        applyLetterStyles();
    }

    // 格式化信件内容
    function formatLetterContent(content) {
        // 分割成行
        const lines = content.split('\n');
        let formattedLines = [];

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            // 保留原始行的缩进信息
            const originalIndent = lines[i].match(/^(\s*)/)[0];

            // 跳过纯空行
            if (line === '') {
                formattedLines.push('');
                continue;
            }

            // 检测是否为称呼行（以"我最亲爱的"或"亲爱的"开头，以冒号结尾）
            if ((line.startsWith('我最亲爱的') || line.startsWith('亲爱的')) && line.endsWith('：')) {
                formattedLines.push(line);
            }
            // 检测是否为右对齐的署名行（通过原始缩进判断）
            else if (originalIndent.length > 20 || isTeacherName(line)) {
                formattedLines.push('<div style="text-align: right;">' + line + '</div>');
            }
            // 其他行作为正文，开头空两格（使用全角空格确保正确显示）
            else {
                formattedLines.push('　　' + line);
            }
        }

        return formattedLines.join('<br>');
    }

    // 检查是否为老师姓名行
    function isTeacherName(line) {
        const teacherName = getCurrentTeacherName();
        return line === teacherName || line.endsWith('老师');
    }

    // 检查是否为中文姓名
    function isChineseName(name) {
        // 使用正则表达式匹配中文字符
        const chineseRegex = /[\u4e00-\u9fa5]+/;
        return chineseRegex.test(name);
    }

    // 获取当前老师姓名
    function getCurrentTeacherName() {
        if (teacherNameSelect.value === 'custom' && customTeacherNameInput.value.trim() !== '') {
            return customTeacherNameInput.value.trim();
        }
        return teacherNameSelect.value;
    }

    // 更新文本位置
    function updateTextPosition() {
        textContainer.style.transform = `translate(${textPosition.x}px, ${textPosition.y}px)`;
    }

    // 更新模板位置
    function updateTemplatePosition() {
        templateContainer.style.transform = `translate(${templatePosition.x}px, ${templatePosition.y}px) scale(${templateSize / 100})`;
        templateContainer.style.transformOrigin = 'center';
    }

    // 更新模板大小
    function updateTemplateSize() {
        templateContainer.style.transform = `translate(${templatePosition.x}px, ${templatePosition.y}px) scale(${templateSize / 100})`;
        templateContainer.style.transformOrigin = 'center';
    }

    // 应用信件样式
    function applyLetterStyles() {
        // 字体
        letterContentPreview.className = 'leading-tight';
        letterContentPreview.classList.add(fontFamilySelect.value);

        // 加粗
        if (fontBoldCheckbox.checked) {
            letterContentPreview.style.fontWeight = 'bold';
        } else {
            letterContentPreview.style.fontWeight = 'normal';
        }

        // 字号
        letterContentPreview.style.fontSize = `${fontSizeSlider.value}px`;

        // 颜色
        letterContentPreview.style.color = fontColorPicker.value;

        // 边距
        letterContentPreview.style.margin = `${marginTopSlider.value}px ${marginRightSlider.value}px ${marginBottomSlider.value}px ${marginLeftSlider.value}px`;

        // 行间距
        const lineHeightSlider = document.getElementById('line-height');
        letterContentPreview.style.lineHeight = lineHeightSlider.value;
    }

    // 更新信件背景
    function updateLetterBackground() {
        templateContainer.innerHTML = ''; // 清空之前的背景

        if (customBackgroundImage) {
            const img = document.createElement('img');
            img.src = customBackgroundImage;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            templateContainer.appendChild(img);
        } else {
            // 应用默认图片模板
            const img = document.createElement('img');
            switch (currentTemplate) {
                case 'template1':
                    img.src = 'template1.svg';
                    break;
                case 'template2':
                    img.src = 'template2.svg';
                    break;
                case 'template4':
                    img.src = 'template4.svg';
                    break;
            }
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            templateContainer.appendChild(img);
        }

        // 应用位置和大小设置
        updateTemplateSize();
    }

    // 更新姓名计数
    function updateNameCount() {
        const names = getNameList();
        nameCountDisplay.textContent = `${names.length} 个姓名`;
    }

    // 获取姓名列表
    function getNameList() {
        return nameListInput.value.split('\n')
            .map(name => name.trim())
            .filter(name => name !== '');
    }

    // 应用高亮到选中文本
    function applyHighlightToSelection() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
            const span = document.createElement('span');
            span.style.backgroundColor = highlightColorPicker.value;
            span.textContent = selectedText;

            range.deleteContents();
            range.insertNode(span);

            // 更新原始文本框内容
            updateOriginalContentWithHighlight(span);
        }
    }

    // 更新原始内容以包含高亮
    function updateOriginalContentWithHighlight(highlightedSpan) {
        // 这个函数需要更复杂的实现来同步富文本和纯文本
        // 目前简化处理，提示用户手动调整
        alert('高亮已应用到预览。由于技术限制，原始文本不会自动更新，请手动调整。');
    }

    // 下载当前信件
    async function downloadSingleLetter() {
        showLoading(true);

        try {
            // 创建临时容器，确保背景图片被正确捕获
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-10000px';
            tempContainer.style.top = '-10000px';
            tempContainer.style.width = letterPreview.offsetWidth + 'px';
            tempContainer.style.height = letterPreview.offsetHeight + 'px';
            tempContainer.style.backgroundColor = 'white';

            // 创建新的模板图片
            const tempTemplate = document.createElement('div');
            tempTemplate.style.position = 'absolute';
            tempTemplate.style.top = '0';
            tempTemplate.style.left = '0';
            tempTemplate.style.width = '100%';
            tempTemplate.style.height = '100%';
            tempTemplate.style.zIndex = '1';

            // 直接使用背景图片URL创建新图片，避免跨域问题
            const img = document.createElement('img');
            img.crossOrigin = 'anonymous'; // 确保跨域图片可以被捕获
            if (customBackgroundImage) {
                img.src = customBackgroundImage;
            } else {
                switch (currentTemplate) {
                    case 'template1':
                        img.src = 'template1.svg';
                        break;
                    case 'template2':
                        img.src = 'template2.svg';
                        break;
                    case 'template4':
                        img.src = 'template4.svg';
                        break;
                }
            }
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            tempTemplate.appendChild(img);

            // 创建新的文本容器
            const tempText = document.createElement('div');
            tempText.style.position = 'absolute';
            tempText.style.top = '0';
            tempText.style.left = '0';
            tempText.style.width = '100%';
            tempText.style.height = '100%';
            tempText.style.padding = '20px';
            tempText.style.boxSizing = 'border-box';
            tempText.style.zIndex = '2';
            tempText.innerHTML = letterContentPreview.innerHTML;
            tempText.className = letterContentPreview.className;
            tempText.style.fontSize = letterContentPreview.style.fontSize;
            tempText.style.fontWeight = letterContentPreview.style.fontWeight;
            tempText.style.color = letterContentPreview.style.color;
            tempText.style.margin = letterContentPreview.style.margin;
            tempText.style.lineHeight = letterContentPreview.style.lineHeight;

            // 添加到临时容器
            tempContainer.appendChild(tempTemplate);
            tempContainer.appendChild(tempText);
            document.body.appendChild(tempContainer);

            // 等待图片加载完成
            await new Promise(resolve => setTimeout(resolve, 200));

            // 生成图片
            const canvas = await html2canvas(tempContainer, {
                scale: 1.5, // 适当降低质量以提高速度
                useCORS: true,
                logging: false,
                backgroundColor: null
            });

            // 移除临时容器
            document.body.removeChild(tempContainer);

            // 创建下载链接
            const link = document.createElement('a');
            const nameList = getNameList();
            const fileName = nameList.length > 0 ? nameList[0] : '信件';
            link.download = `信件_${fileName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            showLoading(false);
        } catch (error) {
            console.error('下载失败:', error);
            statusText.textContent = '下载失败，请重试';
            setTimeout(() => {
                showLoading(false);
            }, 3000);
        }
    }

    // 生成所有信件
    async function generateAllLetters() {
        const names = getNameList();
        if (names.length === 0) {
            alert('请先输入学生姓名');
            return;
        }

        showLoading(true);
        statusText.textContent = '正在生成信件...';
        generatedLetters = [];

        try {
            // 保存原始内容
            const originalContent = letterContentInput.value;
            const teacherName = getCurrentTeacherName();

            for (let i = 0; i < names.length; i++) {
                // 更新进度
                statusText.textContent = `正在生成第 ${i + 1}/${names.length} 封信...`;

                // 更新信件内容
                let content = originalContent;
                content = content.replace(/XX老师/g, teacherName);
                content = content.replace(/XX/g, names[i]);
                letterContentInput.value = content;
                updateLetterPreview();

                // 创建临时容器
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'absolute';
                tempContainer.style.left = '-10000px';
                tempContainer.style.top = '-10000px';
                tempContainer.style.width = letterPreview.offsetWidth + 'px';
                tempContainer.style.height = letterPreview.offsetHeight + 'px';
                tempContainer.style.backgroundColor = 'white';

                // 创建新的模板图片
                const tempTemplate = document.createElement('div');
                tempTemplate.style.position = 'absolute';
                tempTemplate.style.top = '0';
                tempTemplate.style.left = '0';
                tempTemplate.style.width = '100%';
                tempTemplate.style.height = '100%';
                tempTemplate.style.zIndex = '1';

                // 直接使用背景图片URL创建新图片，避免跨域问题
                const img = document.createElement('img');
                img.crossOrigin = 'anonymous'; // 确保跨域图片可以被捕获
                if (customBackgroundImage) {
                    img.src = customBackgroundImage;
                } else {
                    switch (currentTemplate) {
                        case 'template1':
                            img.src = 'template1.svg';
                            break;
                        case 'template2':
                            img.src = 'template2.svg';
                            break;
                        case 'template4':
                            img.src = 'template4.svg';
                            break;
                    }
                }
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                tempTemplate.appendChild(img);

                // 创建新的文本容器
                const tempText = document.createElement('div');
                tempText.style.position = 'absolute';
                tempText.style.top = '0';
                tempText.style.left = '0';
                tempText.style.width = '100%';
                tempText.style.height = '100%';
                tempText.style.padding = '20px';
                tempText.style.boxSizing = 'border-box';
                tempText.style.zIndex = '2';
                tempText.innerHTML = letterContentPreview.innerHTML;
                tempText.className = letterContentPreview.className;
                tempText.style.fontSize = letterContentPreview.style.fontSize;
                tempText.style.fontWeight = letterContentPreview.style.fontWeight;
                tempText.style.color = letterContentPreview.style.color;
                tempText.style.margin = letterContentPreview.style.margin;
                tempText.style.lineHeight = letterContentPreview.style.lineHeight;

                // 添加到临时容器
                tempContainer.appendChild(tempTemplate);
                tempContainer.appendChild(tempText);
                document.body.appendChild(tempContainer);

                // 等待图片加载完成
                await new Promise(resolve => setTimeout(resolve, 200));

                // 生成图片
                const canvas = await html2canvas(tempContainer, {
                    scale: 1.5, // 适当降低质量以提高速度
                    useCORS: true,
                    logging: false,
                    backgroundColor: null
                });

                // 移除临时容器
                document.body.removeChild(tempContainer);

                // 保存图片数据
                generatedLetters.push({
                    name: names[i],
                    imageData: canvas.toDataURL('image/png')
                });

                // 恢复原始内容
                letterContentInput.value = originalContent;
                updateLetterPreview();
            }

            // 显示下载全部按钮
            downloadAllBtn.classList.remove('hidden');
            statusText.textContent = `生成完成，共 ${names.length} 封信`;

            // 3秒后隐藏状态提示
            setTimeout(() => {
                showLoading(false);
            }, 3000);
        } catch (error) {
            console.error('生成失败:', error);
            statusText.textContent = '生成失败，请重试';
            setTimeout(() => {
                showLoading(false);
            }, 3000);
        }
    }

    // 打包下载全部信件
    async function downloadAllLetters() {
        if (generatedLetters.length === 0) {
            alert('没有可下载的信件，请先生成信件');
            return;
        }

        showLoading(true);
        statusText.textContent = '正在准备下载包...';

        try {
            const zip = new JSZip();

            // 添加所有图片到压缩包
            for (let i = 0; i < generatedLetters.length; i++) {
                const letter = generatedLetters[i];
                // 从dataURL中提取二进制数据
                const data = letter.imageData.split(',')[1];
                zip.file(`信件_${letter.name}.png`, data, { base64: true });
            }

            // 生成并下载压缩包
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, '所有信件.zip');

            showLoading(false);
        } catch (error) {
            console.error('打包失败:', error);
            statusText.textContent = '打包失败，请重试';
            setTimeout(() => {
                showLoading(false);
            }, 3000);
        }
    }

    // 显示/隐藏加载状态
    function showLoading(show) {
        if (show) {
            generationStatus.classList.remove('hidden');
            downloadSingleBtn.disabled = true;
            generateAllBtn.disabled = true;
            downloadAllBtn.disabled = true;
        } else {
            generationStatus.classList.add('hidden');
            downloadSingleBtn.disabled = false;
            generateAllBtn.disabled = false;
            downloadAllBtn.disabled = false;
        }
    }
}

// 启动应用
window.addEventListener('DOMContentLoaded', init);
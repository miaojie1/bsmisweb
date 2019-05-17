<template>
    <div>
        <Row :gutter="16">
            <i-col span="8">
                <Input suffix="ios-search" placeholder="输入部位名称查询" v-model="partName"/>
            </i-col>
            <i-col span="8">
                <Button @click="search" type="primary">查询</Button>
                <Button @click="add" type="primary">添加</Button>
            </i-col>
        </Row>
    </div>
</template>
<script>
export default {
    
}
</script>


